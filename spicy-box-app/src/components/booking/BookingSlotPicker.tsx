import { AlarmClock, CakeSlice, Circle, Loader2, Users } from 'lucide-react';
import {
  BOOKING_SLOT_CAPACITY,
  getBookingSlotState,
  getRemainingTables,
  type BookingSlotMetric,
  type BookingTableType,
} from '../../bookingSlots';
import { SESSION_SLOTS, BIRTHDAY_SLOTS, getSlotEndTime } from '../../data/constants';

interface BookingSlotPickerProps {
  tableType: BookingTableType;
  partySize: number;
  metrics: BookingSlotMetric[];
  selectedSlot: string | null;
  claimingSlot: string | null;
  isLoading: boolean;
  loadError: string | null;
  actionError: string | null;
  onTableTypeChange: (tableType: BookingTableType) => void;
  onPartySizeChange: (partySize: number) => void;
  onSelectSlot: (timeSlot: string) => void;
  onRetry: () => void;
}

const STATE_LABELS = {
  available: 'Còn trống',
  processing: 'Đang xử lý',
  full: 'Hết chỗ',
} as const;

function SlotButton({
  timeSlot,
  metric,
  tableType,
  capacity,
  selectedSlot,
  claimingSlot,
  loadError,
  isLoading,
  onSelectSlot,
  isBirthday,
}: {
  timeSlot: string;
  metric: BookingSlotMetric;
  tableType: BookingTableType;
  capacity: number;
  selectedSlot: string | null;
  claimingSlot: string | null;
  loadError: string | null;
  isLoading: boolean;
  onSelectSlot: (t: string) => void;
  isBirthday: boolean;
}) {
  const state = getBookingSlotState(metric, tableType);
  const isSelected = selectedSlot === timeSlot;
  const isClaiming = claimingSlot === timeSlot;
  const isUnavailable = Boolean(loadError) || isLoading;
  const visualState = isUnavailable ? 'unavailable' : isSelected ? 'processing' : state;
  const disabled = isUnavailable || Boolean(claimingSlot) || (state !== 'available' && !isSelected);
  const remaining = getRemainingTables(metric, tableType);
  const endTime = getSlotEndTime(timeSlot);

  return (
    <button
      type="button"
      className={`booking-slot is-${visualState}${isSelected ? ' is-selected' : ''}`}
      disabled={disabled}
      aria-pressed={isSelected}
      onClick={() => onSelectSlot(timeSlot)}
    >
      <span className="booking-slot__top">
        <strong>
          <AlarmClock size={15} aria-hidden="true" /> {timeSlot} – {endTime}
        </strong>
        <em>
          {isClaiming && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
          {isUnavailable
            ? isLoading ? 'Đang tải…' : 'Chưa tải'
            : isClaiming
            ? 'Đang giữ…'
            : isSelected
            ? 'Bạn đang giữ'
            : state === 'full'
            ? '✕ Hết chỗ'
            : STATE_LABELS[state]}
        </em>
      </span>
      <span className="booking-slot__bottom">
        {isBirthday ? (
          <>
            <b>{isUnavailable ? '–/1 suất' : `${metric.confirmedTables}/1 suất`}</b>
            <span>
              {isUnavailable
                ? 'Chưa có dữ liệu'
                : metric.confirmedTables >= 1
                ? `Đã nhận tiệc (${metric.bookedGuests} khách)`
                : 'Chưa có tiệc đặt'}
            </span>
            <small>
              {isUnavailable
                ? 'Tạm khóa chọn giờ'
                : isSelected
                ? `Đang giữ ca ${timeSlot} – ${endTime} (2 tiếng)`
                : state === 'available'
                ? ''
                : state === 'processing'
                ? 'Đang có khách giữ chỗ'
                : `Bận đến ${endTime} · Trống ca lúc ${endTime}`}
            </small>
          </>
        ) : (
          <>
            <b>{isUnavailable ? '–/– bàn' : `${metric.confirmedTables}/${capacity} bàn`}</b>
            <span>{isUnavailable ? 'Chưa có dữ liệu' : `${metric.bookedGuests} người đã đặt`}</span>
            <small>
              {isUnavailable
                ? 'Tạm khóa chọn giờ'
                : isSelected
                ? `Đang giữ ca ${timeSlot} – ${endTime} (2 tiếng)`
                : state === 'available'
                ? `Còn ${remaining} bàn trống`
                : state === 'processing'
                ? 'Đang có khách giữ chỗ'
                : `Hết bàn ca này · Trống lúc ${endTime}`}
            </small>
          </>
        )}
      </span>
    </button>
  );
}

export function BookingSlotPicker({
  tableType,
  partySize,
  metrics,
  selectedSlot,
  claimingSlot,
  isLoading,
  loadError,
  actionError,
  onTableTypeChange,
  onPartySizeChange,
  onSelectSlot,
  onRetry,
}: BookingSlotPickerProps) {
  const metricByTime = new Map(metrics.map(metric => [metric.time, metric]));
  const capacity = BOOKING_SLOT_CAPACITY[tableType];
  const partySizes = tableType === 'standard' ? [1, 2, 3, 4] : [8, 9, 10, 11, 12];
  const isBirthday = tableType === 'birthday';

  const slotProps = (timeSlot: string) => ({
    timeSlot,
    metric: metricByTime.get(timeSlot) ?? { time: timeSlot, confirmedTables: 0, bookedGuests: 0, activeHolds: 0 },
    tableType,
    capacity,
    selectedSlot,
    claimingSlot,
    loadError,
    isLoading,
    onSelectSlot,
    isBirthday,
  });

  return (
    <section className="booking-realtime" aria-labelledby="booking-realtime-title">
      <div className="booking-realtime__header">
        <div>
          <h2 id="booking-realtime-title">Spicy Box · Đặt bàn Realtime</h2>
          <p>
            {isBirthday
              ? 'Bàn sinh nhật trung tâm · Duy nhất 1 suất mỗi ca 2 tiếng'
              : `Bàn tiêu chuẩn · Tối đa ${capacity} bàn online mỗi ca 2 tiếng`}
          </p>
        </div>
        <span className="booking-realtime__live">
          <Circle size={9} fill="currentColor" aria-hidden="true" /> Realtime
        </span>
      </div>

      <div className="booking-table-types" aria-label="Loại bàn">
        <button
          type="button"
          className={tableType === 'standard' ? 'is-active' : ''}
          aria-pressed={tableType === 'standard'}
          onClick={() => onTableTypeChange('standard')}
        >
          <span><Users size={16} aria-hidden="true" /> Bàn tiêu chuẩn</span>
          <strong>1–4 người / bàn</strong>
          <em>5 bàn online · Ca 2 tiếng</em>
        </button>
        <button
          type="button"
          className={tableType === 'birthday' ? 'is-active is-birthday' : ''}
          aria-pressed={tableType === 'birthday'}
          onClick={() => onTableTypeChange('birthday')}
        >
          <span><CakeSlice size={16} aria-hidden="true" /> Bàn sinh nhật</span>
          <strong>8–12 người · Trung tâm quán</strong>
          <em>1 suất / Ca 2 tiếng</em>
        </button>
      </div>

      <div className={`booking-party-size${isBirthday ? ' is-birthday' : ''}`}>
        <div className="booking-party-size__title">
          <span>{isBirthday ? 'Bàn sinh nhật · Trung tâm quán' : 'Chọn số lượng người'}</span>
          <strong>{isBirthday ? 'Chọn 8–12 khách' : 'Tối đa 4 người'}</strong>
        </div>
        <p>
          {isBirthday
            ? 'Bàn tiệc trang trí đẹp nhất quán, mỗi ca cố định 2 tiếng để trang trí và dùng bữa.'
            : 'Mỗi ca ăn lẩu phục vụ trọn vẹn trong 2 tiếng, sau 2 tiếng bàn trống đón ca tiếp theo.'}
        </p>
        <div className="booking-party-size__options">
          {partySizes.map(size => (
            <button
              type="button"
              key={size}
              className={partySize === size ? 'is-active' : ''}
              aria-pressed={partySize === size}
              onClick={() => onPartySizeChange(size)}
            >
              <strong>{size}</strong>
              <span>người</span>
            </button>
          ))}
        </div>
        {isBirthday && (
          <div className="booking-party-size__gift">
            🎁 Tặng vòng phô mai kéo sợi, trang trí nón tiệc và bật nhạc Happy Birthday.
          </div>
        )}
      </div>

      <div className="booking-selection-note">
        {selectedSlot
          ? `Đang giữ ${isBirthday ? 'bàn sinh nhật' : 'bàn tiêu chuẩn'} ca ${selectedSlot} – ${getSlotEndTime(selectedSlot)} (2 tiếng) cho ${partySize} khách.`
          : `Đã chọn ${isBirthday ? 'bàn sinh nhật' : 'bàn tiêu chuẩn'} cho ${partySize} người.`}
      </div>

      <div className="booking-state-legend" aria-label="Trạng thái khung giờ">
        <div className="is-available"><strong><Circle size={10} fill="currentColor" /> Còn trống</strong><span>Có thể chọn ca</span></div>
        <div className="is-processing"><strong><Circle size={10} fill="currentColor" /> Đang xử lý</strong><span>Đang được giữ chỗ</span></div>
        <div className="is-full"><strong><Circle size={10} fill="currentColor" /> Hết chỗ</strong><span>Đã kín chỗ ca này</span></div>
      </div>

      <div className="booking-slot-heading">
        <strong>Khung giờ các ca đặt bàn (Cách nhau 2 tiếng)</strong>
        <span>{isBirthday ? '1 suất duy nhất' : `Tối đa ${capacity} bàn / ca`}</span>
      </div>

      <div style={{ fontSize: '12px', color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '10px 14px', marginBottom: '14px', lineHeight: 1.5 }}>
        ⏰ <strong>Quy định ca phục vụ:</strong> Mỗi ca đặt trọn gói 2 tiếng (09:00–11:00, 11:00–13:00,...). Khi có khách dùng bữa lúc <strong>09:00</strong> thì bàn phục vụ đến <strong>11:00</strong> mới trống để đón lượt khách ca tiếp theo.
      </div>

      {actionError && (
        <div className="booking-slot-error is-action" role="alert">
          <span>{actionError}</span>
        </div>
      )}

      {loadError && (
        <div className="booking-slot-error" role="alert">
          <span>Không tải được sức chứa realtime: {loadError}</span>
          <button type="button" onClick={onRetry}>Thử lại</button>
        </div>
      )}

      {isBirthday ? (
        <div className="booking-slot-session">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3>🎂 Khung giờ tiệc sinh nhật (1 suất duy nhất / ca 2 tiếng)</h3>
          </div>
          <div className="booking-slot-grid">
            {BIRTHDAY_SLOTS.map(timeSlot => (
              <SlotButton key={timeSlot} {...slotProps(timeSlot)} />
            ))}
          </div>
        </div>
      ) : (
        SESSION_SLOTS.map(session => (
          <div className="booking-slot-session" key={session.label}>
            <h3>{session.label}</h3>
            <div className="booking-slot-grid">
              {session.slots.map(timeSlot => (
                <SlotButton key={timeSlot} {...slotProps(timeSlot)} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
