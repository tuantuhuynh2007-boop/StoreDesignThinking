-- Apply once in Supabase SQL Editor before enabling realtime booking slots.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.booking_slot_claims (
  id uuid primary key default gen_random_uuid(),
  branch_code text not null,
  booking_date date not null,
  time_slot time not null,
  table_type text not null check (table_type in ('standard', 'birthday')),
  party_size integer not null check (party_size between 1 and 12),
  client_token_hash text not null,
  status text not null default 'HELD' check (status in ('HELD', 'CONFIRMED', 'CANCELLED')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists booking_slot_claims_lookup
  on public.booking_slot_claims (branch_code, booking_date, time_slot, table_type, status);

alter table public.booking_slot_claims enable row level security;

drop policy if exists "booking slot availability is public" on public.booking_slot_claims;
create policy "booking slot availability is public"
  on public.booking_slot_claims for select
  to anon, authenticated
  using (true);

grant select on public.booking_slot_claims to anon, authenticated;

create or replace function public.get_booking_slot_metrics(
  p_branch_code text,
  p_booking_date date,
  p_table_type text
)
returns table (
  time_slot text,
  confirmed_tables integer,
  booked_guests integer,
  active_holds integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with slots as (
    select (timestamp '2000-01-01 09:30' + step * interval '30 minutes')::time as slot
    from generate_series(0, 25) as step
  )
  select
    to_char(slots.slot, 'HH24:MI'),
    count(c.id) filter (where c.status = 'CONFIRMED')::integer,
    coalesce(sum(c.party_size) filter (where c.status = 'CONFIRMED'), 0)::integer,
    count(c.id) filter (where c.status = 'HELD' and c.expires_at > now())::integer
  from slots
  left join public.booking_slot_claims c
    on c.branch_code = p_branch_code
   and c.booking_date = p_booking_date
   and c.time_slot = slots.slot
   and c.table_type = p_table_type
   and c.status <> 'CANCELLED'
  group by slots.slot
  order by slots.slot;
$$;

create or replace function public.claim_booking_slot(
  p_branch_code text,
  p_booking_date date,
  p_time_slot text,
  p_table_type text,
  p_party_size integer,
  p_client_token text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_capacity integer;
  v_occupied integer;
  v_claim_id uuid;
  v_time time;
begin
  if p_table_type not in ('standard', 'birthday') then
    raise exception 'Loại bàn không hợp lệ';
  end if;
  if (p_table_type = 'standard' and p_party_size not between 1 and 4)
     or (p_table_type = 'birthday' and p_party_size not between 8 and 12) then
    raise exception 'Số khách không phù hợp loại bàn';
  end if;

  v_time := p_time_slot::time;
  v_capacity := case p_table_type when 'birthday' then 1 else 5 end;
  perform pg_advisory_xact_lock(hashtext(concat_ws('|', p_branch_code, p_booking_date, v_time, p_table_type)));

  update public.booking_slot_claims
     set status = 'CANCELLED'
   where client_token_hash = encode(extensions.digest(p_client_token, 'sha256'), 'hex')
     and status = 'HELD';

  select count(*)::integer
    into v_occupied
    from public.booking_slot_claims
   where branch_code = p_branch_code
     and booking_date = p_booking_date
     and time_slot = v_time
     and table_type = p_table_type
     and (status = 'CONFIRMED' or (status = 'HELD' and expires_at > now()));

  if v_occupied >= v_capacity then
    raise exception 'Khung giờ vừa hết chỗ, vui lòng chọn giờ khác';
  end if;

  insert into public.booking_slot_claims (
    branch_code, booking_date, time_slot, table_type, party_size, client_token_hash, expires_at
  ) values (
    p_branch_code, p_booking_date, v_time, p_table_type, p_party_size,
    encode(extensions.digest(p_client_token, 'sha256'), 'hex'), now() + interval '10 minutes'
  ) returning id into v_claim_id;

  return v_claim_id;
end;
$$;

create or replace function public.release_booking_slot(p_claim_id uuid, p_client_token text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  update public.booking_slot_claims
     set status = 'CANCELLED'
   where id = p_claim_id
     and client_token_hash = encode(extensions.digest(p_client_token, 'sha256'), 'hex')
     and status = 'HELD'
  returning true;
$$;

create or replace function public.confirm_booking_slot(p_claim_id uuid, p_client_token text)
returns boolean
language sql
security definer
set search_path = ''
as $$
  update public.booking_slot_claims
     set status = 'CONFIRMED', confirmed_at = now(), expires_at = null
   where id = p_claim_id
     and client_token_hash = encode(extensions.digest(p_client_token, 'sha256'), 'hex')
     and status = 'HELD'
     and expires_at > now()
  returning true;
$$;

revoke all on function public.claim_booking_slot(text, date, text, text, integer, text) from public;
revoke all on function public.release_booking_slot(uuid, text) from public;
revoke all on function public.confirm_booking_slot(uuid, text) from public;
grant execute on function public.get_booking_slot_metrics(text, date, text) to anon, authenticated;
grant execute on function public.claim_booking_slot(text, date, text, text, integer, text) to anon, authenticated;
grant execute on function public.release_booking_slot(uuid, text) to anon, authenticated;
grant execute on function public.confirm_booking_slot(uuid, text) to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'booking_slot_claims'
  ) then
    alter publication supabase_realtime add table public.booking_slot_claims;
  end if;
end $$;
