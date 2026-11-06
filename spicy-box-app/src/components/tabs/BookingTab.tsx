import React, { useState } from 'react';
import { MapPin, Plus, Minus, ArrowLeft, ShieldCheck, Copy, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import type { Branch, ActiveTab } from '../../types';
import {
  ADULT_PRICE,
  CHILD_PRICE,
  PAYMENT_METHODS,
  SPICY_LEVELS,
  DATES,
  SESSION_SLOTS,
} from '../../data/constants';

interface BookingTabProps {
  selectedBranch: Branch;
  onOpenBranchModal: () => void;
  onBookingComplete: (pointsEarned: number, boxesEarned: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const BookingTab: React.FC<BookingTabProps> = ({
  selectedBranch,
  onOpenBranchModal,
  onBookingComplete,
  onNavigateTab,
}) => {
  const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'success'>('form');
  const [selectedDate, setSelectedDate] = useState(DATES[0].key);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [spicyLevel, setSpicyLevel] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('vietqr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingCode, setBookingCode] = useState('SPB-88392');
  const [copiedMemo, setCopiedMemo] = useState(false);

  const totalPrice = adultCount * ADULT_PRICE + childCount * CHILD_PRICE;

  return (
    <div>
      {/* Step Progress Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderRadius: '16px',
          padding: '10px 14px',
          marginBottom: '14px',
          border: '1px solid var(--wood-tint)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: bookingStep === 'form' ? 'var(--red-primary)' : 'var(--status-green)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {bookingStep === 'form' ? '1' : '✓'}
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: bookingStep === 'form' ? 700 : 500,
              color: bookingStep === 'form' ? 'var(--wood-dark)' : 'var(--wood-medium)',
            }}
          >
            Chọn bàn
          </span>
        </div>

        <div
          style={{
            height: 2,
            flex: 1,
            background: bookingStep !== 'form' ? 'var(--status-green)' : 'var(--wood-tint)',
            margin: '0 8px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background:
                bookingStep === 'payment'
                  ? 'var(--red-primary)'
                  : bookingStep === 'success'
                  ? 'var(--status-green)'
                  : 'var(--wood-tint)',
              color: bookingStep === 'form' ? 'var(--wood-medium)' : '#fff',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {bookingStep === 'success' ? '✓' : '2'}
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: bookingStep === 'payment' ? 700 : 500,
              color: bookingStep === 'payment' ? 'var(--wood-dark)' : 'var(--wood-medium)',
            }}
          >
            Thanh toán
          </span>
        </div>

        <div
          style={{
            height: 2,
            flex: 1,
            background: bookingStep === 'success' ? 'var(--status-green)' : 'var(--wood-tint)',
            margin: '0 8px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: bookingStep === 'success' ? 'var(--status-green)' : 'var(--wood-tint)',
              color: bookingStep === 'success' ? '#fff' : 'var(--wood-medium)',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            3
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: bookingStep === 'success' ? 700 : 500,
              color: bookingStep === 'success' ? 'var(--wood-dark)' : 'var(--wood-medium)',
            }}
          >
            Nhận chỗ
          </span>
        </div>
      </div>

      {/* BƯỚC 1: FORM CHỌN BÀN & VÉ */}
      {bookingStep === 'form' && (
        <>
          <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
            Bước 1: Chọn chi nhánh, ngày, giờ & số vé
          </div>

          <div className="card-box">
            {/* 0. Chọn chi nhánh */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--wood-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <MapPin size={14} color="var(--red-primary)" /> Chi nhánh Spicy Box
              </label>
              <button
                onClick={onOpenBranchModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--red-primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Đổi chi nhánh ➔
              </button>
            </div>
            <div
              onClick={onOpenBranchModal}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'var(--bg-surface-subtle)',
                border: '1.5px solid var(--wood-tint)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: '18px',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wood-dark)' }}>
                  {selectedBranch.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--wood-medium)', marginTop: '2px' }}>
                  {selectedBranch.mall} • {selectedBranch.city}
                </div>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  background: '#FEE2E2',
                  color: 'var(--red-primary)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                Thay đổi
              </div>
            </div>

            {/* 1. Chọn ngày */}
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
                color: 'var(--wood-dark)',
              }}
            >
              1. Chọn ngày ăn lẩu
            </label>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                marginBottom: '18px',
              }}
            >
              {DATES.map(d => (
                <button
                  key={d.key}
                  onClick={() => setSelectedDate(d.key)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px 14px',
                    borderRadius: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedDate === d.key ? 'var(--wood-dark)' : 'var(--bg-surface-subtle)',
                    color: selectedDate === d.key ? '#fff' : 'var(--wood-medium)',
                    fontWeight: selectedDate === d.key ? 700 : 400,
                    transition: 'all 0.18s',
                  }}
                >
                  <span style={{ fontSize: '11px' }}>{d.label}</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{d.day}</span>
                </button>
              ))}
            </div>

            {/* 2. Khung giờ */}
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '10px',
                color: 'var(--wood-dark)',
              }}
            >
              2. Chọn khung giờ đến (9:30 - 22:00)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '4px' }}>
              {SESSION_SLOTS.map(session => (
                <div key={session.label}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--wood-medium)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {session.emoji} {session.label}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {session.slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: selectedSlot === slot ? 700 : 500,
                          background: selectedSlot === slot ? 'var(--red-primary)' : 'var(--bg-surface-subtle)',
                          color: selectedSlot === slot ? '#fff' : 'var(--wood-dark)',
                          transition: 'all 0.18s',
                          boxShadow: selectedSlot === slot ? '0 2px 8px rgba(197,34,31,0.3)' : 'none',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-box">
            {/* 3. Số lượng khách */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wood-dark)', margin: 0 }}>
                3. Số lượng vé Buffet Tokpokki
              </label>
              <span
                style={{
                  fontSize: '11px',
                  color: '#B45309',
                  background: '#FEF3C7',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontWeight: 600,
                }}
              >
                Menu không giới hạn
              </span>
            </div>

            {/* Người lớn */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Vé Người lớn</div>
                <div style={{ fontSize: '12px', color: 'var(--red-primary)', fontWeight: 600 }}>
                  {ADULT_PRICE.toLocaleString('vi-VN')} đ / vé
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => setAdultCount(prev => Math.max(1, prev - 1))}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1.5px solid var(--wood-light)',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {adultCount}
                </span>
                <button
                  onClick={() => setAdultCount(prev => Math.min(20, prev + 1))}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--red-primary)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Trẻ em */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid var(--wood-tint)',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Vé Trẻ em</div>
                <div style={{ fontSize: '12px', color: 'var(--red-primary)', fontWeight: 600 }}>
                  {CHILD_PRICE.toLocaleString('vi-VN')} đ / vé (Dưới 1m3)
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => setChildCount(prev => Math.max(0, prev - 1))}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1.5px solid var(--wood-light)',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {childCount}
                </span>
                <button
                  onClick={() => setChildCount(prev => Math.min(10, prev + 1))}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--red-primary)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="card-box">
            {/* 4. Vị cay */}
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '12px',
                color: 'var(--wood-dark)',
              }}
            >
              4. Vị sốt lẩu ưu tiên
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SPICY_LEVELS.map(level => (
                <button
                  key={level.key}
                  onClick={() => setSpicyLevel(level.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    background: spicyLevel === level.key ? 'var(--red-light)' : 'var(--bg-surface-subtle)',
                    outline: spicyLevel === level.key ? '2px solid var(--red-primary)' : '2px solid transparent',
                    transition: 'all 0.18s',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--wood-dark)' }}>
                      {level.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--wood-medium)', marginTop: '2px' }}>
                      {level.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${spicyLevel === level.key ? 'var(--red-primary)' : 'var(--wood-light)'}`,
                      background: spicyLevel === level.key ? 'var(--red-primary)' : 'transparent',
                      transition: 'all 0.18s',
                      flexShrink: 0,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Box tạm tính tiền */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
              border: '1px solid #FDBA74',
              borderRadius: '16px',
              padding: '14px 16px',
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9A3412',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Tạm tính tiền vé ({adultCount} lớn{childCount > 0 ? `, ${childCount} trẻ` : ''})
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--red-primary)',
                  marginTop: '2px',
                }}
              >
                {totalPrice.toLocaleString('vi-VN')} đ
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: '#C2410C',
                fontWeight: 600,
                background: '#FED7AA',
                padding: '4px 10px',
                borderRadius: '99px',
              }}
            >
              Thanh toán trước
            </span>
          </div>

          <button
            className="btn-pill btn-red"
            onClick={() => {
              if (!selectedSlot) {
                alert('Vui lòng chọn khung giờ đến!');
                return;
              }
              if (!spicyLevel) {
                alert('Vui lòng chọn vị sốt lẩu!');
                return;
              }
              setBookingStep('payment');
            }}
          >
            Tiếp tục thanh toán ({totalPrice.toLocaleString('vi-VN')} đ) ➔
          </button>
        </>
      )}

      {/* BƯỚC 2: THANH TOÁN */}
      {bookingStep === 'payment' && (
        <>
          <button
            onClick={() => setBookingStep('form')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--wood-medium)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '0 0 12px 0',
            }}
          >
            <ArrowLeft size={16} /> Quay lại điều chỉnh bàn
          </button>

          <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
            Bước 2: Thanh toán đặt cọc / Giữ vé
          </div>

          {/* Card tóm tắt đơn đặt */}
          <div className="card-box" style={{ marginBottom: '14px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wood-dark)' }}>
                Thông tin bàn đặt
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#047857',
                  background: '#D1FAE5',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  fontWeight: 600,
                }}
              >
                {selectedBranch.name.replace('Spicy Box ', '')}
              </span>
            </div>

            <div
              style={{
                fontSize: '12px',
                color: 'var(--wood-medium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Chi nhánh:</span>
                <strong
                  style={{ color: 'var(--wood-dark)', textAlign: 'right', maxWidth: '60%' }}
                >
                  {selectedBranch.name} ({selectedBranch.mall})
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Thời gian ăn lẩu:</span>
                <strong style={{ color: 'var(--wood-dark)' }}>
                  {selectedSlot} • {DATES.find(d => d.key === selectedDate)?.label} (
                  {DATES.find(d => d.key === selectedDate)?.day})
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Vị sốt lẩu:</span>
                <strong style={{ color: 'var(--wood-dark)' }}>
                  {SPICY_LEVELS.find(s => s.key === spicyLevel)?.label}
                </strong>
              </div>
              <div style={{ height: 1, background: 'var(--wood-tint)', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{adultCount}x Vé Người lớn (129k):</span>
                <span style={{ color: 'var(--wood-dark)', fontWeight: 600 }}>
                  {(adultCount * ADULT_PRICE).toLocaleString('vi-VN')} đ
                </span>
              </div>
              {childCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{childCount}x Vé Trẻ em (79k):</span>
                  <span style={{ color: 'var(--wood-dark)', fontWeight: 600 }}>
                    {(childCount * CHILD_PRICE).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Phí giữ bàn & check-in ưu tiên:</span>
                <span style={{ color: 'var(--status-green)', fontWeight: 600 }}>0 đ (Miễn phí)</span>
              </div>
              <div style={{ height: 1, background: 'var(--wood-tint)', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: 'var(--wood-dark)' }}>
                  TỔNG CẦN THANH TOÁN:
                </strong>
                <strong style={{ fontSize: '20px', color: 'var(--red-primary)' }}>
                  {totalPrice.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            </div>
          </div>

          {/* Card chọn phương thức thanh toán */}
          <div className="card-box" style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontSize: '13px',
                fontWeight: 600,
                display: 'block',
                marginBottom: '10px',
                color: 'var(--wood-dark)',
              }}
            >
              Chọn phương thức thanh toán
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    background: paymentMethod === m.id ? 'var(--red-light)' : 'var(--bg-surface-subtle)',
                    outline: paymentMethod === m.id ? '2px solid var(--red-primary)' : '1px solid transparent',
                    textAlign: 'left',
                    transition: 'all 0.18s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>{m.icon}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wood-dark)' }}
                        >
                          {m.name}
                        </span>
                        {m.badge && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              background: '#FEF3C7',
                              color: '#D97706',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--wood-medium)',
                          marginTop: '2px',
                        }}
                      >
                        {m.desc}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${
                        paymentMethod === m.id ? 'var(--red-primary)' : 'var(--wood-light)'
                      }`,
                      background: paymentMethod === m.id ? 'var(--red-primary)' : 'transparent',
                      flexShrink: 0,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* QR Box & Bank Transfer Info */}
          <div
            className="card-box"
            style={{
              background: '#FAF8F5',
              border: '1px solid var(--wood-tint)',
              textAlign: 'center',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '10px',
                fontSize: '12px',
                color: '#B45309',
                fontWeight: 600,
              }}
            >
              <span>⏱️ Bàn đang được giữ tạm trong: <strong>09:59</strong></span>
            </div>

            {/* QR Box */}
            <div
              style={{
                width: 160,
                height: 160,
                margin: '0 auto 12px auto',
                background: '#fff',
                borderRadius: '16px',
                border: '2px solid var(--wood-tint)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#0054A6',
                  marginBottom: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                {paymentMethod === 'momo'
                  ? 'VÍ ĐIỆN TỬ MOMO'
                  : paymentMethod === 'zalopay'
                  ? 'VÍ ZALOPAY'
                  : 'VIETQR • NAPAS 247'}
              </div>
              <div
                style={{
                  width: 100,
                  height: 100,
                  background: '#111827',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '38px' }}>📲</div>
                <img
                  src="./assets/spicy-box-logo.png"
                  alt="Spicy Box Pay"
                  style={{
                    height: '16px',
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </div>
              <div style={{ fontSize: '9px', color: 'var(--wood-medium)', marginTop: '4px' }}>
                Mở app quét mã để thanh toán
              </div>
            </div>

            {/* Thông tin chuyển khoản */}
            <div
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '10px 14px',
                textAlign: 'left',
                fontSize: '12px',
                border: '1px solid var(--wood-tint)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--wood-medium)' }}>Ngân hàng thụ hưởng:</span>
                <strong style={{ color: 'var(--wood-dark)' }}>MB Bank (Quân Đội)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--wood-medium)' }}>Chủ tài khoản:</span>
                <strong style={{ color: 'var(--wood-dark)' }}>SPICY BOX VIETNAM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--wood-medium)' }}>Số tài khoản:</span>
                <strong
                  style={{
                    color: 'var(--red-primary)',
                    fontFamily: 'monospace',
                    fontSize: '13px',
                  }}
                >
                  0909888999
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--wood-medium)' }}>Số tiền:</span>
                <strong style={{ color: 'var(--red-primary)', fontSize: '14px' }}>
                  {totalPrice.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '6px',
                  borderTop: '1px dashed var(--wood-tint)',
                }}
              >
                <span style={{ color: 'var(--wood-medium)' }}>Nội dung CK:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong
                    style={{ color: '#1E40AF', fontFamily: 'monospace', fontSize: '13px' }}
                  >
                    {bookingCode}
                  </strong>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(bookingCode);
                      }
                      setCopiedMemo(true);
                      setTimeout(() => setCopiedMemo(false), 2000);
                    }}
                    style={{
                      background: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      color: '#3730A3',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Copy size={11} /> {copiedMemo ? 'Đã sao chép!' : 'Sao chép'}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '10px',
                fontSize: '11px',
                color: 'var(--status-green)',
              }}
            >
              <ShieldCheck size={14} /> Giao dịch được bảo mật SSL 256-bit & Tự động duyệt
            </div>
          </div>

          <button
            className="btn-pill btn-red"
            disabled={isProcessing}
            onClick={() => {
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
                setBookingStep('success');
                onBookingComplete(25, 1);
              }, 1400);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isProcessing ? 0.75 : 1,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Đang xác thực giao dịch với ngân hàng...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Xác nhận tôi đã thanh toán ({totalPrice.toLocaleString('vi-VN')} đ)</span>
              </>
            )}
          </button>
        </>
      )}

      {/* BƯỚC 3: MÀN HÌNH XÁC NHẬN THÀNH CÔNG */}
      {bookingStep === 'success' && (
        <div className="card-box" style={{ textAlign: 'center', padding: '24px 18px' }}>
          <div style={{ fontSize: '48px', marginBottom: '6px' }}>🎉</div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DCFCE7',
              color: '#15803D',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '10px',
            }}
          >
            <CheckCircle size={14} /> ĐÃ THANH TOÁN & ĐẶT BÀN THÀNH CÔNG
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--wood-dark)',
              marginBottom: '4px',
            }}
          >
            Hẹn gặp bạn tại Spicy Box!
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--wood-medium)', marginBottom: '16px' }}>
            Mã đặt chỗ <strong>#{bookingCode}</strong> đã được lưu vào hệ thống POS chi nhánh.
          </p>

          <div
            style={{
              background: 'var(--bg-surface-subtle)',
              borderRadius: '16px',
              padding: '14px',
              marginBottom: '16px',
              textAlign: 'left',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--wood-medium)' }}>Chi nhánh:</span>
              <strong
                style={{ color: 'var(--wood-dark)', textAlign: 'right', maxWidth: '60%' }}
              >
                {selectedBranch.name} ({selectedBranch.mall})
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--wood-medium)' }}>Địa chỉ:</span>
              <span
                style={{
                  color: 'var(--wood-dark)',
                  textAlign: 'right',
                  maxWidth: '60%',
                  fontSize: '11px',
                }}
              >
                {selectedBranch.address}, {selectedBranch.city}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--wood-medium)' }}>Thời gian:</span>
              <strong style={{ color: 'var(--wood-dark)' }}>
                {selectedSlot} • {DATES.find(d => d.key === selectedDate)?.label} (
                {DATES.find(d => d.key === selectedDate)?.day})
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--wood-medium)' }}>Số lượng vé:</span>
              <strong style={{ color: 'var(--wood-dark)' }}>
                {adultCount} Lớn{childCount > 0 ? `, ${childCount} Trẻ em` : ''}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: 'var(--wood-medium)' }}>Vị sốt:</span>
              <strong style={{ color: 'var(--wood-dark)' }}>
                {SPICY_LEVELS.find(s => s.key === spicyLevel)?.label}
              </strong>
            </div>
            <div style={{ height: 1, background: 'var(--wood-tint)', margin: '6px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--wood-medium)' }}>Tổng tiền đã thanh toán:</span>
              <strong style={{ color: 'var(--red-primary)', fontSize: '15px' }}>
                {totalPrice.toLocaleString('vi-VN')} đ
              </strong>
            </div>
          </div>

          <div
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '12px',
              color: '#92400E',
            }}
          >
            <div>🎁 Nhận ngay <strong>+1 Lượt Mở Hộp Mù Blind Box</strong>!</div>
            <div style={{ marginTop: '2px' }}>
              🌶️ Đã tích lũy <strong>+25 Ớt Vàng</strong> vào ví thành viên!
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn-pill btn-gold" onClick={() => onNavigateTab('gacha')}>
              <Sparkles size={16} /> Mở Hộp Blind Box Vịt Vàng ngay
            </button>
            <button
              className="btn-pill btn-outline"
              onClick={() => {
                setBookingStep('form');
                setSelectedSlot(null);
                setSpicyLevel(null);
                setBookingCode(`SPB-${Math.floor(10000 + Math.random() * 90000)}`);
              }}
            >
              Đặt thêm bàn khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
