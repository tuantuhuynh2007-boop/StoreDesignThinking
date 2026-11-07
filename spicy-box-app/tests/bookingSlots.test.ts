import assert from 'node:assert/strict';
import test from 'node:test';
import {
  beginBookingClaim,
  beginBookingRefresh,
  createBookingRequestGate,
  endBookingClaim,
  getBookingSlotState,
  getBookingSlotErrorMessage,
  getRemainingTables,
  invalidateBookingContext,
  isBookingClaimCurrent,
  isBookingRefreshCurrent,
  type BookingSlotMetric,
} from '../src/bookingSlots.ts';

const metric = (confirmedTables: number, activeHolds: number): BookingSlotMetric => ({
  time: '18:00',
  confirmedTables,
  bookedGuests: confirmedTables * 2,
  activeHolds,
});

test('standard slot stays available while fewer than five tables are occupied', () => {
  assert.equal(getBookingSlotState(metric(3, 1), 'standard'), 'available');
  assert.equal(getRemainingTables(metric(3, 1), 'standard'), 1);
});

test('standard slot is processing when active holds occupy the last table', () => {
  assert.equal(getBookingSlotState(metric(4, 1), 'standard'), 'processing');
  assert.equal(getRemainingTables(metric(4, 1), 'standard'), 0);
});

test('standard slot is full when five tables are confirmed', () => {
  assert.equal(getBookingSlotState(metric(5, 0), 'standard'), 'full');
  assert.equal(getRemainingTables(metric(5, 0), 'standard'), 0);
});

test('birthday slot has one-table capacity', () => {
  assert.equal(getBookingSlotState(metric(0, 0), 'birthday'), 'available');
  assert.equal(getBookingSlotState(metric(0, 1), 'birthday'), 'processing');
  assert.equal(getBookingSlotState(metric(1, 0), 'birthday'), 'full');
});

test('remaining tables never becomes negative for stale over-capacity data', () => {
  assert.equal(getRemainingTables(metric(7, 2), 'standard'), 0);
});

test('schema-cache errors are converted to a user-safe setup message', () => {
  assert.equal(
    getBookingSlotErrorMessage('Could not find the function public.get_booking_slot_metrics in the schema cache'),
    'Hệ thống giữ chỗ realtime chưa được khởi tạo.',
  );
});

test('context invalidation rejects a late claim response', () => {
  const gate = createBookingRequestGate();
  const claim = beginBookingClaim(gate);
  assert.ok(claim);

  invalidateBookingContext(gate);

  assert.equal(isBookingClaimCurrent(gate, claim), false);
});

test('only one claim can be active until the current claim finishes', () => {
  const gate = createBookingRequestGate();
  const first = beginBookingClaim(gate);
  assert.ok(first);
  assert.equal(beginBookingClaim(gate), null);

  endBookingClaim(gate, first);

  assert.ok(beginBookingClaim(gate));
});

test('only the latest refresh response can update slot metrics', () => {
  const gate = createBookingRequestGate();
  const first = beginBookingRefresh(gate);
  const second = beginBookingRefresh(gate);

  assert.equal(isBookingRefreshCurrent(gate, first), false);
  assert.equal(isBookingRefreshCurrent(gate, second), true);
});
