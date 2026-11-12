-- Keep database metrics aligned with the two-hour sessions shown by the booking UI.
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
  with slots(slot) as (
    select unnest(array[
      '09:00'::time,
      '11:00'::time,
      '13:00'::time,
      '15:00'::time,
      '17:00'::time,
      '19:00'::time,
      '21:00'::time
    ])
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

grant execute on function public.get_booking_slot_metrics(text, date, text) to anon, authenticated;
