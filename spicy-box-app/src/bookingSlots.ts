export type BookingTableType = 'standard' | 'birthday';
export type BookingSlotState = 'available' | 'processing' | 'full';

export interface BookingSlotMetric {
  time: string;
  confirmedTables: number;
  bookedGuests: number;
  activeHolds: number;
}

export interface BookingRequestTicket {
  context: number;
  request: number;
}

export interface BookingRequestGate {
  context: number;
  claimRequest: number;
  refreshRequest: number;
  claimInFlight: boolean;
}

export const BOOKING_SLOT_CAPACITY: Record<BookingTableType, number> = {
  standard: 5,
  birthday: 1,
};

export function createBookingRequestGate(): BookingRequestGate {
  return { context: 0, claimRequest: 0, refreshRequest: 0, claimInFlight: false };
}

export function invalidateBookingContext(gate: BookingRequestGate) {
  gate.context += 1;
  gate.claimRequest += 1;
  gate.refreshRequest += 1;
  gate.claimInFlight = false;
}

export function beginBookingClaim(gate: BookingRequestGate): BookingRequestTicket | null {
  if (gate.claimInFlight) return null;
  gate.claimInFlight = true;
  return { context: gate.context, request: ++gate.claimRequest };
}

export function endBookingClaim(gate: BookingRequestGate, ticket: BookingRequestTicket) {
  if (ticket.context === gate.context) gate.claimInFlight = false;
}

export function isBookingClaimCurrent(gate: BookingRequestGate, ticket: BookingRequestTicket) {
  return gate.claimInFlight && ticket.context === gate.context && ticket.request === gate.claimRequest;
}

export function beginBookingRefresh(gate: BookingRequestGate): BookingRequestTicket {
  return { context: gate.context, request: ++gate.refreshRequest };
}

export function isBookingRefreshCurrent(gate: BookingRequestGate, ticket: BookingRequestTicket) {
  return ticket.context === gate.context && ticket.request === gate.refreshRequest;
}

export function getRemainingTables(metric: BookingSlotMetric, tableType: BookingTableType) {
  return Math.max(0, BOOKING_SLOT_CAPACITY[tableType] - metric.confirmedTables - metric.activeHolds);
}

export function getBookingSlotState(
  metric: BookingSlotMetric,
  tableType: BookingTableType,
): BookingSlotState {
  const capacity = BOOKING_SLOT_CAPACITY[tableType];

  if (metric.confirmedTables >= capacity) return 'full';
  if (metric.confirmedTables + metric.activeHolds >= capacity) return 'processing';
  return 'available';
}

export function getBookingSlotErrorMessage(message: string) {
  if (message.includes('schema cache') || message.includes('get_booking_slot_metrics')) {
    return 'Hệ thống giữ chỗ realtime chưa được khởi tạo.';
  }
  return 'Không thể đồng bộ sức chứa khung giờ. Vui lòng thử lại.';
}
