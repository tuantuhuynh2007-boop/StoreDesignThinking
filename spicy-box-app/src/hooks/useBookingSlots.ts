import { useCallback, useEffect, useRef, useState } from 'react';
import {
  claimBookingSlot,
  confirmBookingSlot,
  fetchBookingSlotMetrics,
  releaseBookingSlot,
  subscribeToBookingSlots,
} from '../bookingSlotApi';
import {
  beginBookingClaim,
  beginBookingRefresh,
  createBookingRequestGate,
  endBookingClaim,
  invalidateBookingContext,
  isBookingClaimCurrent,
  isBookingRefreshCurrent,
  type BookingSlotMetric,
  type BookingTableType,
} from '../bookingSlots';

interface UseBookingSlotsOptions {
  branchCode?: string;
  bookingDate: string;
  tableType: BookingTableType;
  partySize: number;
}

const CLIENT_TOKEN_KEY = 'spicy_box_booking_client_token';
const HOLD_DURATION_MS = 10 * 60 * 1000;
const REFRESH_INTERVAL_MS = 30 * 1000;

interface ActiveClaim {
  id: string;
  expiresAt: number;
}

export class BookingHoldExpiredError extends Error {}

function getClientToken() {
  const saved = sessionStorage.getItem(CLIENT_TOKEN_KEY);
  if (saved) return saved;

  const token = crypto.randomUUID();
  sessionStorage.setItem(CLIENT_TOKEN_KEY, token);
  return token;
}

export function useBookingSlots({
  branchCode,
  bookingDate,
  tableType,
  partySize,
}: UseBookingSlotsOptions) {
  const [metrics, setMetrics] = useState<BookingSlotMetric[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [claimingSlot, setClaimingSlot] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const claimRef = useRef<ActiveClaim | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const [clientToken] = useState(() => typeof window === 'undefined' ? '' : getClientToken());
  const [requestGate] = useState(createBookingRequestGate);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) window.clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
  }, []);

  const releaseWithRetry = useCallback(async (claimId: string) => {
    if (!clientToken) return;
    try {
      await releaseBookingSlot(claimId, clientToken);
    } catch {
      await new Promise(resolve => window.setTimeout(resolve, 1000));
      await releaseBookingSlot(claimId, clientToken);
    }
  }, [clientToken]);

  const refresh = useCallback(async () => {
    const ticket = beginBookingRefresh(requestGate);
    if (!branchCode) {
      if (isBookingRefreshCurrent(requestGate, ticket)) setMetrics([]);
      return;
    }

    try {
      const nextMetrics = await fetchBookingSlotMetrics(branchCode, bookingDate, tableType);
      if (!isBookingRefreshCurrent(requestGate, ticket)) return;
      setMetrics(nextMetrics);
      setLoadError(null);
    } catch (cause) {
      if (!isBookingRefreshCurrent(requestGate, ticket)) return;
      setLoadError(cause instanceof Error ? cause.message : 'Không tải được sức chứa khung giờ.');
    }
  }, [branchCode, bookingDate, requestGate, tableType]);

  const releaseSelection = useCallback(async () => {
    const claim = claimRef.current;
    if (claim) await releaseWithRetry(claim.id);
    if (claimRef.current?.id === claim?.id) claimRef.current = null;
    clearHoldTimer();
    setSelectedSlot(null);
    setActionError(null);
    await refresh();
  }, [clearHoldTimer, refresh, releaseWithRetry]);

  useEffect(() => {
    invalidateBookingContext(requestGate);
    const staleClaim = claimRef.current;
    claimRef.current = null;
    clearHoldTimer();
    // oxlint-disable-next-line react/set-state-in-effect -- Context changes must not display stale capacity.
    setMetrics([]);
    // oxlint-disable-next-line react/set-state-in-effect -- A claim is released when its context changes.
    setSelectedSlot(null);
    // oxlint-disable-next-line react/set-state-in-effect -- A pending claim cannot carry into a new context.
    setClaimingSlot(null);
    // oxlint-disable-next-line react/set-state-in-effect -- Errors belong to the context that produced them.
    setActionError(null);
    // oxlint-disable-next-line react/set-state-in-effect -- Initial server snapshot belongs to this subscription lifecycle.
    void refresh();
    if (staleClaim) void releaseWithRetry(staleClaim.id).catch(() => {});

    if (!branchCode) return;
    const channel = subscribeToBookingSlots(branchCode, () => void refresh());
    const refreshTimer = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);

    return () => {
      invalidateBookingContext(requestGate);
      void channel.unsubscribe();
      window.clearInterval(refreshTimer);
      clearHoldTimer();
      const claim = claimRef.current;
      claimRef.current = null;
      // shortcut: hard browser close may keep the hold until its 10-minute expiry, upgrade to a server heartbeat for immediate disconnect cleanup.
      if (claim) void releaseWithRetry(claim.id).catch(() => {});
    };
  }, [branchCode, bookingDate, clearHoldTimer, partySize, refresh, releaseWithRetry, requestGate, tableType]);

  const selectSlot = useCallback(async (timeSlot: string) => {
    if (!branchCode || !clientToken) return;
    const ticket = beginBookingClaim(requestGate);
    if (!ticket) return;
    setClaimingSlot(timeSlot);
    setActionError(null);
    let newClaimId: string | null = null;

    try {
      if (claimRef.current) await releaseSelection();
      if (!isBookingClaimCurrent(requestGate, ticket)) return;
      newClaimId = await claimBookingSlot(
        branchCode,
        bookingDate,
        timeSlot,
        tableType,
        partySize,
        clientToken,
      );
      if (!isBookingClaimCurrent(requestGate, ticket)) {
        await releaseWithRetry(newClaimId);
        return;
      }

      claimRef.current = { id: newClaimId, expiresAt: Date.now() + HOLD_DURATION_MS };
      setSelectedSlot(timeSlot);
      clearHoldTimer();
      holdTimerRef.current = window.setTimeout(() => {
        if (claimRef.current?.id !== newClaimId) return;
        claimRef.current = null;
        setSelectedSlot(null);
        setActionError('Lượt giữ bàn đã hết hạn. Vui lòng chọn lại khung giờ.');
        void refresh();
      }, HOLD_DURATION_MS);
      await refresh();
    } catch (cause) {
      if (newClaimId) void releaseWithRetry(newClaimId).catch(() => {});
      if (isBookingClaimCurrent(requestGate, ticket)) {
        setActionError(cause instanceof Error ? cause.message : 'Không thể giữ khung giờ này.');
      }
      await refresh();
    } finally {
      const isCurrent = isBookingClaimCurrent(requestGate, ticket);
      endBookingClaim(requestGate, ticket);
      if (isCurrent) setClaimingSlot(null);
    }
  }, [branchCode, bookingDate, clearHoldTimer, clientToken, partySize, refresh, releaseSelection, releaseWithRetry, requestGate, tableType]);

  const confirmSelection = useCallback(async () => {
    const claim = claimRef.current;
    if (!claim || !clientToken || claim.expiresAt <= Date.now()) {
      claimRef.current = null;
      clearHoldTimer();
      setSelectedSlot(null);
      throw new BookingHoldExpiredError('Lượt giữ bàn đã hết hạn. Vui lòng chọn lại khung giờ.');
    }

    const confirmed = await confirmBookingSlot(claim.id, clientToken);
    if (!confirmed) {
      claimRef.current = null;
      clearHoldTimer();
      setSelectedSlot(null);
      throw new BookingHoldExpiredError('Lượt giữ bàn đã hết hạn. Vui lòng chọn lại khung giờ.');
    }
    claimRef.current = null;
    clearHoldTimer();
    setActionError(null);
    await refresh();
  }, [clearHoldTimer, clientToken, refresh]);

  return {
    metrics,
    selectedSlot,
    claimingSlot,
    isLoading: Boolean(branchCode) && metrics.length === 0 && loadError === null,
    loadError,
    actionError,
    selectSlot,
    releaseSelection,
    confirmSelection,
    refresh,
  };
}
