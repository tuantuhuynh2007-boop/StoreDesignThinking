import { AlarmClock, CakeSlice, Circle, Loader2, Users } from 'lucide-react';
import {
  BOOKING_SLOT_CAPACITY,
  getBookingSlotState,
  getRemainingTables,
  type BookingSlotMetric,
  type BookingTableType,
} from '../../bookingSlots';
import { SESSION_SLOTS } from '../../data/constants';

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

  return (
    <section className="booking-realtime" aria-labelledby="booking-realtime-title">
      <div className="booking-realtime__header">
        <div>
          <h2 id="booking-realtime-title">Spicy Box · Đặt bàn Realtime</h2>
          <p>Tối đa {capacity} bàn online mỗi khung giờ</p>
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
          <em>5 bàn online</em>
        </button>
        <button
          type="button"
          className={tableType === 'birthday' ? 'is-active is-birthday' : ''}
          aria-pressed={tableType === 'birthday'}
          onClick={() => onTableTypeChange('birthday')}
        >
          <span><CakeSlice size={16} aria-hidden="true" /> Bàn sinh nhật</span>
          <strong>8–12 người · Trung tâm quán</strong>
          <em>1 suất</em>
        </button>
      </div>

      <div className={`booking-party-size${tableType === 'birthday' ? ' is-birthday' : ''}`}>
        <div className="booking-party-size__title">
          <span>{tableType === 'standard' ? 'Chọn số lượng người' : 'Bàn sinh nhật · Trung tâm quán'}</span>
          <strong>{tableType === 'standard' ? 'Tối đa 4 người' : 'Chọn 8–12 khách'}</strong>
        </div>
        {tableType === 'birthday' && (
          <p>Bàn tiệc trang trí đẹp nhất, nhận đúng một suất trong mỗi khung giờ.</p>
        )}
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
        {tableType === 'birthday' && (
          <div className="booking-party-size__gift">
            Tặng vòng phô mai kéo sợi, trang trí nền tiệc và nhạc Happy Birthday.
          </div>
        )}
      </div>

      <div className="booking-selection-note">
        {selectedSlot
          ? `Đang giữ bàn ${tableType === 'birthday' ? 'sinh nhật' : 'tiêu chuẩn'} lúc ${selectedSlot} cho ${partySize} người trong 10 phút.`
          : `Đã chọn bàn ${tableType === 'birthday' ? 'sinh nhật' : 'tiêu chuẩn'} cho ${partySize} người.`}
      </div>

      <div className="booking-state-legend" aria-label="Trạng thái khung giờ">
        <div className="is-available"><strong><Circle size={10} fill="currentColor" /> Còn trống</strong><span>Có thể chọn giờ</span></div>
        <div className="is-processing"><strong><Circle size={10} fill="currentColor" /> Đang xử lý</strong><span>Đang được giữ</span></div>
        <div className="is-full"><strong><Circle size={10} fill="currentColor" /> Hết chỗ</strong><span>Không thể chọn</span></div>
      </div>

      <div className="booking-slot-heading">
        <strong>Khung giờ đặt bàn</strong>
        <span>Tối đa {capacity} bàn</span>
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

      {SESSION_SLOTS.map(session => (
        <div className="booking-slot-session" key={session.label}>
          <h3>{session.label}</h3>
          <div className="booking-slot-grid">
            {session.slots.map(timeSlot => {
              const metric = metricByTime.get(timeSlot) ?? {
                time: timeSlot,
                confirmedTables: 0,
                bookedGuests: 0,
                activeHolds: 0,
              };
              const state = getBookingSlotState(metric, tableType);
              const isSelected = selectedSlot === timeSlot;
              const isClaiming = claimingSlot === timeSlot;
              const isUnavailable = Boolean(loadError) || isLoading;
              const visualState = isUnavailable ? 'unavailable' : isSelected ? 'processing' : state;
              const disabled = isUnavailable || Boolean(claimingSlot) || (state !== 'available' && !isSelected);
              const remaining = getRemainingTables(metric, tableType);

              return (
                <button
                  type="button"
                  key={timeSlot}
                  className={`booking-slot is-${visualState}${isSelected ? ' is-selected' : ''}`}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  onClick={() => onSelectSlot(timeSlot)}
                >
                  <span className="booking-slot__top">
                    <strong><AlarmClock size={15} aria-hidden="true" /> {timeSlot}</strong>
                    <em>
                      {isClaiming && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                      {isUnavailable
                        ? isLoading ? 'Đang tải…' : 'Chưa tải'
                        : isClaiming ? 'Đang giữ…' : isSelected ? 'Bạn đang giữ' : STATE_LABELS[state]}
                    </em>
                  </span>
                  <span className="booking-slot__bottom">
                    <b>{isUnavailable ? '–/– bàn' : `${metric.confirmedTables}/${capacity} bàn`}</b>
                    <span>{isUnavailable ? 'Chưa có dữ liệu' : `${metric.bookedGuests} người đã đặt`}</span>
                    <small>
                      {isUnavailable
                        ? 'Tạm khóa chọn giờ'
                        : isSelected
                        ? 'Giữ trong 10 phút'
                        : state === 'available'
                          ? `Còn ${remaining} bàn`
                          : state === 'processing'
                            ? 'Đang chờ xác nhận'
                            : 'Đã đủ sức chứa'}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
