import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { getBookingSlotErrorMessage, type BookingSlotMetric, type BookingTableType } from './bookingSlots';

interface SlotMetricRow {
  time_slot: string;
  confirmed_tables: number;
  booked_guests: number;
  active_holds: number;
}

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('Supabase không trả về dữ liệu.');
  return data;
}

export async function fetchBookingSlotMetrics(
  branchCode: string,
  bookingDate: string,
  tableType: BookingTableType,
): Promise<BookingSlotMetric[]> {
  const { data, error } = await supabase.rpc('get_booking_slot_metrics', {
    p_branch_code: branchCode,
    p_booking_date: bookingDate,
    p_table_type: tableType,
  });

  if (error) throw new Error(getBookingSlotErrorMessage(error.message));
  return requireData(data as SlotMetricRow[] | null, null).map(row => ({
    time: row.time_slot,
    confirmedTables: row.confirmed_tables,
    bookedGuests: row.booked_guests,
    activeHolds: row.active_holds,
  }));
}

export async function claimBookingSlot(
  branchCode: string,
  bookingDate: string,
  timeSlot: string,
  tableType: BookingTableType,
  partySize: number,
  clientToken: string,
): Promise<string> {
  const { data, error } = await supabase.rpc('claim_booking_slot', {
    p_branch_code: branchCode,
    p_booking_date: bookingDate,
    p_time_slot: timeSlot,
    p_table_type: tableType,
    p_party_size: partySize,
    p_client_token: clientToken,
  });
  return requireData(data as string | null, error);
}

export async function releaseBookingSlot(claimId: string, clientToken: string) {
  const { data, error } = await supabase.rpc('release_booking_slot', {
    p_claim_id: claimId,
    p_client_token: clientToken,
  });
  return requireData(data as boolean | null, error);
}

export async function confirmBookingSlot(claimId: string, clientToken: string) {
  const { data, error } = await supabase.rpc('confirm_booking_slot', {
    p_claim_id: claimId,
    p_client_token: clientToken,
  });
  return requireData(data as boolean | null, error);
}

export function subscribeToBookingSlots(branchCode: string, onChange: () => void): RealtimeChannel {
  return supabase
    .channel(`booking-slots:${branchCode}:${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'booking_slot_claims', filter: `branch_code=eq.${branchCode}` },
      onChange,
    )
    .subscribe();
}
