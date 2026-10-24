import { useState } from 'react';
import { Home, Calendar, Gift, BookOpen, Ticket, CheckCircle, Sparkles, Plus, Minus, ArrowLeft, ShieldCheck, Copy, Loader2 } from 'lucide-react';
import type { Season, Mascot } from './types';
import { INITIAL_MASCOTS } from './data/mascots';

// ---- Booking helpers ----
const ADULT_PRICE = 129000;
const CHILD_PRICE = 79000;

const PAYMENT_METHODS = [
  { id: 'vietqr', name: 'VietQR / Ngân hàng (Miễn phí)', desc: 'Quét mã VietQR bằng mọi app ngân hàng', icon: '🏦', badge: 'Khuyên dùng' },
  { id: 'momo', name: 'Ví điện tử MoMo', desc: 'Quét QR hoặc thanh toán 1 chạm MoMo', icon: '🟣', badge: 'Ưu đãi' },
  { id: 'zalopay', name: 'Ví ZaloPay', desc: 'Mở app ZaloPay xác nhận thanh toán', icon: '🟢' },
  { id: 'card', name: 'Thẻ ATM / Visa / Mastercard', desc: 'Cổng thanh toán thẻ an toàn bảo mật', icon: '💳' },
];
const today = new Date();
const DATES = Array.from({ length: 5 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return {
    label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : d.toLocaleDateString('vi-VN', { weekday: 'short' }),
    day: `${d.getDate()}/${d.getMonth() + 1}`,
    key: d.toISOString().slice(0, 10),
  };
});

// Spicy Box hoạt động 09:30 – 22:00, mỗi 30 phút
const ALL_SLOTS = [
  '09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30',
  '21:00','21:30','22:00',
];
// Phân ca theo giờ
const SESSION_SLOTS: { label: string; emoji: string; slots: string[] }[] = [
  { label: 'Buổi sáng', emoji: '🌅', slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 9 && h < 12; }) },
  { label: 'Buổi trưa',  emoji: '☀️',  slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 12 && h < 15; }) },
  { label: 'Buổi chiều', emoji: '🌤️', slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 15 && h < 18; }) },
  { label: 'Buổi tối',   emoji: '🌙', slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 18; }) },
];
const SPICY_LEVELS = [
  { key: 'mild', label: '🌶️ Cay nhẹ', desc: 'Hơi tê tê nhẹ' },
  { key: 'medium', label: '🌶️🌶️ Cay vừa', desc: 'Chuẩn Hàn Quốc' },
  { key: 'hot', label: '🌶️🌶️🌶️ Cực cay', desc: 'Dành cho chiến binh' },
];

export function App() {
  const [currentSeason, setCurrentSeason] = useState<Season>('HALLOWEEN');
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'gacha' | 'album' | 'rewards'>('home');
  const [points, setPoints] = useState(120);
  const [servingNum] = useState(18);

  // Booking state — 3 bước: 'form' | 'payment' | 'success'
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
  const [myNum] = useState(20);
  const [availableBoxes, setAvailableBoxes] = useState(2);
  const [mascots, setMascots] = useState<Mascot[]>(INITIAL_MASCOTS);
  const [unlockedDuck, setUnlockedDuck] = useState<Mascot | null>(null);

  // Filter mascots for current season
  const seasonMascots = mascots.filter(m => m.season === currentSeason);
  const unlockedCount = seasonMascots.filter(m => m.isUnlocked).length;

  const handleOpenBox = () => {
    if (availableBoxes <= 0) {
      alert('Bạn đã hết lượt mở hộp! Hãy dùng bữa tại Spicy Box để nhận thêm lượt nhé.');
      return;
    }
    setAvailableBoxes(prev => prev - 1);

    // Pick a random duck of the current season
    const randomDuck = seasonMascots[Math.floor(Math.random() * seasonMascots.length)];

    // Unlock it
    setMascots(prev => prev.map(m => {
      if (m.id === randomDuck.id) {
        return { ...m, isUnlocked: true, count: m.count + 1 };
      }
      return m;
    }));

    setUnlockedDuck(randomDuck);
  };

  const handleRedeem = (title: string, cost: number) => {
    if (points < cost) {
      alert('Bạn không đủ Ớt Vàng để đổi ưu đãi này!');
      return;
    }
    setPoints(prev => prev - cost);
    alert(`Đổi thành công: ${title}! (-${cost} Ớt Vàng). Mã QR đã sẵn sàng trong ví.`);
  };

  const getSeasonBanner = () => {
    switch (currentSeason) {
      case 'CHRISTMAS':
        return { title: '❄️ GIÁNG SINH TOKPOKKI ẤM ÁP', sub: 'Tuyết rơi đón Noel - Săn Vịt Khăn Len!' };
      case 'TET':
        return { title: '🧧 TẾT NGUYÊN ĐÁN RỘN RÀNG', sub: 'Lẩu đầu năm phát tài - Săn Vịt Áo Dài Đỏ!' };
      case 'MIDAUTUMN':
        return { title: '🥮 TRUNG THU ĐOÀN VIÊN', sub: 'Rước đèn ăn lẩu - Săn Vịt Đèn Lồng!' };
      default:
        return { title: '🎃 HALLOWEEN SPICY FEST', sub: 'Ăn lẩu thả ga - Săn Vịt Bí Ngô giới hạn!' };
    }
  };

  const banner = getSeasonBanner();

  return (
    <div className="device-wrapper">
      {/* Top Island */}
      <div className="device-island"></div>

      {/* Header */}
      <header className="top-header">
        <div className="brand-box">
          <div className="brand-icon">🌶️</div>
          <div>
            <div className="brand-name">SPICY BOX</div>
            <div className="branch-text">Vincom Thảo Điền ▾</div>
          </div>
        </div>
        <div className="chili-badge">
          <span>🌶️</span>
          <span>{points} Ớt</span>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div>
            {/* Season Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
              border: '1px solid rgba(229, 169, 60, 0.4)',
              borderRadius: '22px',
              padding: '14px 18px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#B45309' }}>{banner.title}</h4>
                <p style={{ fontSize: '12px', color: '#92400E', marginTop: '2px' }}>{banner.sub}</p>
              </div>
              <span style={{
                background: '#EA580C', color: '#fff', fontSize: '11px', fontWeight: 600,
                padding: '4px 10px', borderRadius: '9999px'
              }}>Live</span>
            </div>

            {/* Live Queue Card */}
            <div className="card-box" style={{ borderTop: '6px solid var(--red-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--wood-medium)', textTransform: 'uppercase' }}>
                  Hàng chờ trực tiếp
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--status-green)', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, background: 'var(--status-green)', borderRadius: '50%' }}></span>
                  Đang hoạt động
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 16px 0', borderBottom: '1px dashed var(--wood-light)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>ĐANG PHỤC VỤ</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--wood-dark)' }}>A-{servingNum}</div>
                </div>
                <div style={{ width: 1, height: 40, background: 'var(--wood-tint)' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>SỐ CỦA BẠN</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--red-primary)' }}>A-{myNum}</div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--wood-medium)', textAlign: 'center', margin: '14px 0' }}>
                ⏳ Còn <strong style={{ color: 'var(--red-primary)' }}>{myNum - servingNum} lượt nữa</strong> là đến bạn (~10 phút). Bạn có thể thong thả dạo TTTM!
              </p>

              <button className="btn-pill btn-red" onClick={() => alert('Hệ thống đã báo nhân viên bạn đang có mặt trước cửa Spicy Box!')}>
                <CheckCircle size={18} /> Tôi đã có mặt tại cửa quán
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Tiện ích nhanh</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="card-box" style={{ padding: '16px', cursor: 'pointer', margin: 0 }} onClick={() => setActiveTab('booking')}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Calendar size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Đặt bàn tiệc</div>
                <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Không lo hết chỗ</div>
              </div>

              <div className="card-box" style={{ padding: '16px', cursor: 'pointer', margin: 0 }} onClick={() => setActiveTab('gacha')}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Gift size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Mở Blind Box</div>
                <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Săn Vịt Vàng 3D</div>
              </div>

              <div className="card-box" style={{ padding: '16px', cursor: 'pointer', margin: 0 }} onClick={() => setActiveTab('album')}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <BookOpen size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Sổ Vịt 4 Mùa</div>
                <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>{unlockedCount}/6 biểu cảm</div>
              </div>

              <div className="card-box" style={{ padding: '16px', cursor: 'pointer', margin: 0 }} onClick={() => setActiveTab('rewards')}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Ticket size={20} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Ví Ớt & Voucher</div>
                <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Đổi phô mai, bò Mỹ</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKING */}
        {activeTab === 'booking' && (
          <div>
            {/* Step Progress Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#fff', borderRadius: '16px', padding: '10px 14px', marginBottom: '14px',
              border: '1px solid var(--wood-tint)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: bookingStep === 'form' ? 'var(--red-primary)' : 'var(--status-green)',
                  color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {bookingStep === 'form' ? '1' : '✓'}
                </div>
                <span style={{ fontSize: '11px', fontWeight: bookingStep === 'form' ? 700 : 500, color: bookingStep === 'form' ? 'var(--wood-dark)' : 'var(--wood-medium)' }}>
                  Chọn bàn
                </span>
              </div>

              <div style={{ height: 2, flex: 1, background: bookingStep !== 'form' ? 'var(--status-green)' : 'var(--wood-tint)', margin: '0 8px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: bookingStep === 'payment' ? 'var(--red-primary)' : bookingStep === 'success' ? 'var(--status-green)' : 'var(--wood-tint)',
                  color: bookingStep === 'form' ? 'var(--wood-medium)' : '#fff',
                  fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {bookingStep === 'success' ? '✓' : '2'}
                </div>
                <span style={{ fontSize: '11px', fontWeight: bookingStep === 'payment' ? 700 : 500, color: bookingStep === 'payment' ? 'var(--wood-dark)' : 'var(--wood-medium)' }}>
                  Thanh toán
                </span>
              </div>

              <div style={{ height: 2, flex: 1, background: bookingStep === 'success' ? 'var(--status-green)' : 'var(--wood-tint)', margin: '0 8px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: bookingStep === 'success' ? 'var(--status-green)' : 'var(--wood-tint)',
                  color: bookingStep === 'success' ? '#fff' : 'var(--wood-medium)',
                  fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  3
                </div>
                <span style={{ fontSize: '11px', fontWeight: bookingStep === 'success' ? 700 : 500, color: bookingStep === 'success' ? 'var(--wood-dark)' : 'var(--wood-medium)' }}>
                  Nhận chỗ
                </span>
              </div>
            </div>

            {/* BƯỚC 1: FORM CHỌN BÀN & VÉ */}
            {bookingStep === 'form' && (
              <>
                <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>Bước 1: Chọn ngày, giờ & số vé</div>

                <div className="card-box">
                  {/* 1. Chọn ngày */}
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--wood-dark)' }}>
                    1. Chọn ngày ăn lẩu
                  </label>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '18px' }}>
                    {DATES.map(d => (
                      <button
                        key={d.key}
                        onClick={() => setSelectedDate(d.key)}
                        style={{
                          flexShrink: 0,
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          padding: '8px 14px', borderRadius: '14px', border: 'none', cursor: 'pointer',
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

                  {/* 2. Khung giờ — 09:30 đến 22:00, chia 4 ca */}
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--wood-dark)' }}>
                    2. Chọn khung giờ đến (9:30 - 22:00)
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '4px' }}>
                    {SESSION_SLOTS.map(session => (
                      <div key={session.label}>
                        <div style={{
                          fontSize: '11px', fontWeight: 700, color: 'var(--wood-medium)',
                          textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px',
                          display: 'flex', alignItems: 'center', gap: '4px'
                        }}>
                          {session.emoji} {session.label}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {session.slots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              style={{
                                padding: '8px 4px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                fontSize: '13px', fontWeight: selectedSlot === slot ? 700 : 500,
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--wood-dark)', margin: 0 }}>
                      3. Số lượng vé Buffet Tokpokki
                    </label>
                    <span style={{ fontSize: '11px', color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                      Menu không giới hạn
                    </span>
                  </div>

                  {/* Người lớn */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Vé Người lớn</div>
                      <div style={{ fontSize: '12px', color: 'var(--red-primary)', fontWeight: 600 }}>{ADULT_PRICE.toLocaleString('vi-VN')} đ / vé</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <button
                        onClick={() => setAdultCount(prev => Math.max(1, prev - 1))}
                        style={{
                          width: 34, height: 34, borderRadius: '50%', border: '1.5px solid var(--wood-light)',
                          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '18px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{adultCount}</span>
                      <button
                        onClick={() => setAdultCount(prev => Math.min(20, prev + 1))}
                        style={{
                          width: 34, height: 34, borderRadius: '50%', border: 'none',
                          background: 'var(--red-primary)', color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Trẻ em */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--wood-tint)' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Vé Trẻ em</div>
                      <div style={{ fontSize: '12px', color: 'var(--red-primary)', fontWeight: 600 }}>{CHILD_PRICE.toLocaleString('vi-VN')} đ / vé (Dưới 1m3)</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <button
                        onClick={() => setChildCount(prev => Math.max(0, prev - 1))}
                        style={{
                          width: 34, height: 34, borderRadius: '50%', border: '1.5px solid var(--wood-light)',
                          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontSize: '18px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{childCount}</span>
                      <button
                        onClick={() => setChildCount(prev => Math.min(10, prev + 1))}
                        style={{
                          width: 34, height: 34, borderRadius: '50%', border: 'none',
                          background: 'var(--red-primary)', color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-box">
                  {/* 4. Vị cay */}
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '12px', color: 'var(--wood-dark)' }}>
                    4. Vị sốt lẩu ưu tiên
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {SPICY_LEVELS.map(level => (
                      <button
                        key={level.key}
                        onClick={() => setSpicyLevel(level.key)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                          background: spicyLevel === level.key ? 'var(--red-light)' : 'var(--bg-surface-subtle)',
                          outline: spicyLevel === level.key ? '2px solid var(--red-primary)' : '2px solid transparent',
                          transition: 'all 0.18s',
                          textAlign: 'left',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--wood-dark)' }}>{level.label}</div>
                          <div style={{ fontSize: '11px', color: 'var(--wood-medium)', marginTop: '2px' }}>{level.desc}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${spicyLevel === level.key ? 'var(--red-primary)' : 'var(--wood-light)'}`,
                          background: spicyLevel === level.key ? 'var(--red-primary)' : 'transparent',
                          transition: 'all 0.18s',
                          flexShrink: 0,
                        }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Box tạm tính tiền */}
                <div style={{
                  background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                  border: '1px solid #FDBA74',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  marginBottom: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#9A3412', fontWeight: 600, textTransform: 'uppercase' }}>Tạm tính tiền vé ({adultCount} lớn{childCount > 0 ? `, ${childCount} trẻ` : ''})</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--red-primary)', marginTop: '2px' }}>
                      {totalPrice.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#C2410C', fontWeight: 600, background: '#FED7AA', padding: '4px 10px', borderRadius: '99px' }}>
                    Thanh toán trước
                  </span>
                </div>

                <button
                  className="btn-pill btn-red"
                  onClick={() => {
                    if (!selectedSlot) { alert('Vui lòng chọn khung giờ đến!'); return; }
                    if (!spicyLevel) { alert('Vui lòng chọn vị sốt lẩu!'); return; }
                    setBookingStep('payment');
                  }}
                >
                  Tiếp tục thanh toán ({totalPrice.toLocaleString('vi-VN')} đ) ➔
                </button>
              </>
            )}

            {/* BƯỚC 2: THANH TOÁN (BẮT BUỘC ĐỂ ĐƯỢC XÁC NHẬN) */}
            {bookingStep === 'payment' && (
              <>
                <button
                  onClick={() => setBookingStep('form')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: 'var(--wood-medium)', fontSize: '13px', fontWeight: 600,
                    padding: '0 0 12px 0'
                  }}
                >
                  <ArrowLeft size={16} /> Quay lại điều chỉnh bàn
                </button>

                <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>Bước 2: Thanh toán đặt cọc / Giữ vé</div>

                {/* Card tóm tắt đơn đặt */}
                <div className="card-box" style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wood-dark)' }}>Thông tin bàn đặt</span>
                    <span style={{ fontSize: '11px', color: '#047857', background: '#D1FAE5', padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                      Vincom Thảo Điền
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--wood-medium)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Thời gian ăn lẩu:</span>
                      <strong style={{ color: 'var(--wood-dark)' }}>
                        {selectedSlot} • {DATES.find(d => d.key === selectedDate)?.label} ({DATES.find(d => d.key === selectedDate)?.day})
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Vị sốt lẩu:</span>
                      <strong style={{ color: 'var(--wood-dark)' }}>{SPICY_LEVELS.find(s => s.key === spicyLevel)?.label}</strong>
                    </div>
                    <div style={{ height: 1, background: 'var(--wood-tint)', margin: '4px 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{adultCount}x Vé Người lớn (129k):</span>
                      <span style={{ color: 'var(--wood-dark)', fontWeight: 600 }}>{(adultCount * ADULT_PRICE).toLocaleString('vi-VN')} đ</span>
                    </div>
                    {childCount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{childCount}x Vé Trẻ em (79k):</span>
                        <span style={{ color: 'var(--wood-dark)', fontWeight: 600 }}>{(childCount * CHILD_PRICE).toLocaleString('vi-VN')} đ</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Phí giữ bàn & check-in ưu tiên:</span>
                      <span style={{ color: 'var(--status-green)', fontWeight: 600 }}>0 đ (Miễn phí)</span>
                    </div>
                    <div style={{ height: 1, background: 'var(--wood-tint)', margin: '4px 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--wood-dark)' }}>TỔNG CẦN THANH TOÁN:</strong>
                      <strong style={{ fontSize: '20px', color: 'var(--red-primary)' }}>{totalPrice.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  </div>
                </div>

                {/* Card chọn phương thức thanh toán */}
                <div className="card-box" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px', color: 'var(--wood-dark)' }}>
                    Chọn phương thức thanh toán
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {PAYMENT_METHODS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                          background: paymentMethod === m.id ? 'var(--red-light)' : 'var(--bg-surface-subtle)',
                          outline: paymentMethod === m.id ? '2px solid var(--red-primary)' : '1px solid transparent',
                          textAlign: 'left', transition: 'all 0.18s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '22px' }}>{m.icon}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wood-dark)' }}>{m.name}</span>
                              {m.badge && (
                                <span style={{
                                  fontSize: '9px', fontWeight: 700, background: '#FEF3C7', color: '#D97706',
                                  padding: '2px 6px', borderRadius: '4px'
                                }}>
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--wood-medium)', marginTop: '2px' }}>{m.desc}</div>
                          </div>
                        </div>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: `2px solid ${paymentMethod === m.id ? 'var(--red-primary)' : 'var(--wood-light)'}`,
                          background: paymentMethod === m.id ? 'var(--red-primary)' : 'transparent',
                          flexShrink: 0
                        }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card hiển thị mã QR & tài khoản chuyển khoản mô phỏng chân thực */}
                <div className="card-box" style={{ background: '#FAF8F5', border: '1px solid var(--wood-tint)', textAlign: 'center', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '10px', fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                    <span>⏱️ Bàn đang được giữ tạm trong: <strong>09:59</strong></span>
                  </div>

                  {/* QR Box */}
                  <div style={{
                    width: 160, height: 160, margin: '0 auto 12px auto',
                    background: '#fff', borderRadius: '16px', border: '2px solid var(--wood-tint)',
                    padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#0054A6', marginBottom: '4px', letterSpacing: '0.5px' }}>
                      {paymentMethod === 'momo' ? 'VÍ ĐIỆN TỬ MOMO' : paymentMethod === 'zalopay' ? 'VÍ ZALOPAY' : 'VIETQR • NAPAS 247'}
                    </div>
                    <div style={{
                      width: 100, height: 100, background: '#111827', borderRadius: '8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff',
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{ fontSize: '38px' }}>📲</div>
                      <div style={{ fontSize: '8px', color: '#FCD34D', fontWeight: 700 }}>SPICY BOX PAY</div>
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--wood-medium)', marginTop: '4px' }}>
                      Mở app quét mã để thanh toán
                    </div>
                  </div>

                  {/* Thông tin chuyển khoản chi tiết */}
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '10px 14px', textAlign: 'left', fontSize: '12px', border: '1px solid var(--wood-tint)' }}>
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
                      <strong style={{ color: 'var(--red-primary)', fontFamily: 'monospace', fontSize: '13px' }}>0909888999</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--wood-medium)' }}>Số tiền:</span>
                      <strong style={{ color: 'var(--red-primary)', fontSize: '14px' }}>{totalPrice.toLocaleString('vi-VN')} đ</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--wood-tint)' }}>
                      <span style={{ color: 'var(--wood-medium)' }}>Nội dung CK:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ color: '#1E40AF', fontFamily: 'monospace', fontSize: '13px' }}>{bookingCode}</strong>
                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(bookingCode);
                            }
                            setCopiedMemo(true);
                            setTimeout(() => setCopiedMemo(false), 2000);
                          }}
                          style={{
                            background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '6px',
                            padding: '2px 8px', fontSize: '11px', color: '#3730A3', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '3px'
                          }}
                        >
                          <Copy size={11} /> {copiedMemo ? 'Đã sao chép!' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: 'var(--status-green)' }}>
                    <ShieldCheck size={14} /> Giao dịch được bảo mật SSL 256-bit & Tự động duyệt
                  </div>
                </div>

                {/* Nút thanh toán với trạng thái loading */}
                <button
                  className="btn-pill btn-red"
                  disabled={isProcessing}
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setIsProcessing(false);
                      setBookingStep('success');
                      setAvailableBoxes(prev => prev + 1);
                      setPoints(prev => prev + 25);
                    }, 1400);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    opacity: isProcessing ? 0.75 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer'
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

            {/* BƯỚC 3: MÀN HÌNH XÁC NHẬN ĐẶT BÀN THÀNH CÔNG (CHỈ XUẤT HIỆN SAU KHI THANH TOÁN XONG) */}
            {bookingStep === 'success' && (
              <div className="card-box" style={{ textAlign: 'center', padding: '24px 18px' }}>
                <div style={{ fontSize: '48px', marginBottom: '6px' }}>🎉</div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#DCFCE7', color: '#15803D', padding: '4px 14px', borderRadius: '9999px',
                  fontSize: '12px', fontWeight: 700, marginBottom: '10px'
                }}>
                  <CheckCircle size={14} /> ĐÃ THANH TOÁN & ĐẶT BÀN THÀNH CÔNG
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--wood-dark)', marginBottom: '4px' }}>
                  Hẹn gặp bạn tại Spicy Box!
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--wood-medium)', marginBottom: '16px' }}>
                  Mã đặt chỗ <strong>#{bookingCode}</strong> đã được lưu vào hệ thống POS chi nhánh.
                </p>

                {/* Chi tiết đơn đã thanh toán */}
                <div style={{ background: 'var(--bg-surface-subtle)', borderRadius: '16px', padding: '14px', marginBottom: '16px', textAlign: 'left', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--wood-medium)' }}>Chi nhánh:</span>
                    <strong style={{ color: 'var(--wood-dark)' }}>Spicy Box Vincom Thảo Điền</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--wood-medium)' }}>Thời gian:</span>
                    <strong style={{ color: 'var(--wood-dark)' }}>
                      {selectedSlot} • {DATES.find(d => d.key === selectedDate)?.label} ({DATES.find(d => d.key === selectedDate)?.day})
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--wood-medium)' }}>Số lượng vé:</span>
                    <strong style={{ color: 'var(--wood-dark)' }}>
                      {adultCount} người lớn{childCount > 0 ? ` + ${childCount} trẻ em` : ''}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--wood-medium)' }}>Vị lẩu ưu tiên:</span>
                    <strong style={{ color: 'var(--wood-dark)' }}>{SPICY_LEVELS.find(s => s.key === spicyLevel)?.label ?? '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed var(--wood-tint)' }}>
                    <span style={{ color: 'var(--wood-medium)' }}>Trạng thái thanh toán:</span>
                    <strong style={{ color: 'var(--status-green)', fontSize: '13px' }}>
                      Đã thanh toán đủ {totalPrice.toLocaleString('vi-VN')} đ ✓
                    </strong>
                  </div>
                </div>

                {/* QR Code Check-in */}
                <div style={{
                  width: 140, height: 140, margin: '0 auto 10px auto',
                  background: 'var(--wood-dark)', borderRadius: '18px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '42px', boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                }}>
                  📲
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--wood-dark)', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  MÃ CHECK-IN: #{bookingCode}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--wood-medium)', marginBottom: '16px' }}>
                  Xuất trình mã này cho nhân viên lễ tân để được dẫn thẳng vào bàn mà không cần chờ.
                </p>

                {/* Banner quà tặng đặt bàn trước */}
                <div style={{
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1px solid var(--gold-accent)', borderRadius: '14px',
                  padding: '12px 14px', marginBottom: '16px', textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#B45309' }}>
                    <Sparkles size={16} /> QUÀ TẶNG ĐẶT BÀN SỚM:
                  </div>
                  <div style={{ fontSize: '11px', color: '#92400E', marginTop: '4px', lineHeight: '1.4' }}>
                    🎁 Đã cộng <strong>+1 Lượt Mở Hộp Blind Box Vịt Vàng</strong>!<br />
                    🌶️ Đã tích lũy <strong>+25 Ớt Vàng</strong> vào ví thành viên!
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="btn-pill btn-gold" onClick={() => setActiveTab('gacha')}>
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
        )}

        {/* TAB 3: BLIND BOX */}
        {activeTab === 'gacha' && (
          <div className="card-box" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red-primary)', textTransform: 'uppercase' }}>
              Mỗi lần ăn lẩu • Nhận 1 hộp mù
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '6px 0 16px 0' }}>HỘP QUÀ VỊT VÀNG 3D</h3>

            <div
              style={{
                width: 170, height: 170, margin: '16px auto',
                background: 'linear-gradient(135deg, #C5221F 0%, #8E1614 100%)',
                borderRadius: '32px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 16px 36px rgba(197, 34, 31, 0.35)',
                cursor: 'pointer', position: 'relative'
              }}
              onClick={handleOpenBox}
            >
              <div style={{ position: 'absolute', width: '100%', height: 24, background: 'var(--gold-gradient)' }}></div>
              <div style={{ fontSize: '44px', zIndex: 2 }}>🎀</div>
              <div style={{ color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', marginTop: '10px', zIndex: 2 }}>SPICY BOX</div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--wood-medium)', margin: '16px 0' }}>
              Bạn đang có: <strong style={{ color: 'var(--red-primary)', fontSize: '18px' }}>{availableBoxes}</strong> lượt mở hộp
            </p>

            <button className="btn-pill btn-gold" onClick={handleOpenBox}>
              <Sparkles size={18} /> Chạm để mở Hộp Quà Bí Ẩn
            </button>
          </div>
        )}

        {/* TAB 4: DUCK ALBUM */}
        {activeTab === 'album' && (
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Sổ Sưu Tập Vịt Vàng 4 Mùa</div>

            {/* Season Selector */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
              <button
                style={{ padding: '8px 16px', borderRadius: '9999px', border: 'none', background: currentSeason === 'HALLOWEEN' ? 'var(--wood-dark)' : '#fff', color: currentSeason === 'HALLOWEEN' ? '#fff' : 'var(--wood-medium)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setCurrentSeason('HALLOWEEN')}
              >
                🎃 Halloween
              </button>
              <button
                style={{ padding: '8px 16px', borderRadius: '9999px', border: 'none', background: currentSeason === 'CHRISTMAS' ? 'var(--wood-dark)' : '#fff', color: currentSeason === 'CHRISTMAS' ? '#fff' : 'var(--wood-medium)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setCurrentSeason('CHRISTMAS')}
              >
                ❄️ Giáng Sinh
              </button>
              <button
                style={{ padding: '8px 16px', borderRadius: '9999px', border: 'none', background: currentSeason === 'TET' ? 'var(--wood-dark)' : '#fff', color: currentSeason === 'TET' ? '#fff' : 'var(--wood-medium)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setCurrentSeason('TET')}
              >
                🧧 Tết Nguyên Đán
              </button>
              <button
                style={{ padding: '8px 16px', borderRadius: '9999px', border: 'none', background: currentSeason === 'MIDAUTUMN' ? 'var(--wood-dark)' : '#fff', color: currentSeason === 'MIDAUTUMN' ? '#fff' : 'var(--wood-medium)', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setCurrentSeason('MIDAUTUMN')}
              >
                🥮 Trung Thu
              </button>
            </div>

            {/* Progress Card */}
            <div style={{ background: 'var(--gold-light)', border: '1px solid var(--gold-accent)', borderRadius: '16px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                <span>Tiến độ mùa hiện tại</span>
                <span>{unlockedCount} / 6 Vịt</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(229, 169, 60, 0.3)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${(unlockedCount / 6) * 100}%`, height: '100%', background: 'var(--gold-accent)', borderRadius: 99 }}></div>
              </div>
              <p style={{ fontSize: '11px', color: '#92400E', marginTop: '6px' }}>
                ★ Gom đủ 6/6 biểu cảm để nhận <strong>01 Vòng Phô Mai Kéo Sợi</strong> miễn phí!
              </p>
            </div>

            {/* 6 Ducks Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {seasonMascots.map(duck => (
                <div key={duck.id} className="card-box" style={{ padding: '12px', textAlign: 'center', margin: 0, opacity: duck.isUnlocked ? 1 : 0.6 }}>
                  <div style={{
                    width: '100%', height: 110, borderRadius: 14, background: '#F6F2EA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 8,
                    position: 'relative'
                  }}>
                    <img
                      src={duck.image}
                      alt={duck.name}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        filter: duck.isUnlocked ? 'none' : 'brightness(0) opacity(0.25)'
                      }}
                    />
                    {!duck.isUnlocked && (
                      <span style={{ position: 'absolute', fontSize: '32px', fontWeight: 700, color: 'var(--wood-medium)' }}>?</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{duck.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--wood-medium)', marginTop: '2px' }}>
                    {duck.isUnlocked ? `Đã sở hữu: x${duck.count}` : 'Chưa mở khóa'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REWARDS */}
        {activeTab === 'rewards' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #4A2E1B 0%, #2A170C 100%)',
              color: '#fff', borderRadius: '22px', padding: '20px', marginBottom: '18px',
              boxShadow: '0 10px 25px rgba(42, 23, 12, 0.3)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-accent)', border: '1px solid var(--gold-accent)', padding: '3px 10px', borderRadius: '9999px' }}>
                SPICY BOX GOLD VIP
              </span>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '12px' }}>SỐ DƯ ĐIỂM:</div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{points} Ớt Vàng 🌶️</div>
              <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px' }}>Mã thành viên: #SPB-99812</div>
            </div>

            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Ưu đãi đổi bằng Ớt Vàng</div>
            
            <div className="card-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🧀</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Vòng Phô Mai Kéo Sợi</div>
                <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Cần: 50 Ớt Vàng</div>
              </div>
              <button style={{ padding: '8px 14px', borderRadius: '9999px', background: 'var(--gold-gradient)', border: 'none', fontWeight: 700, cursor: 'pointer' }} onClick={() => handleRedeem('Vòng Phô Mai Kéo Sợi', 50)}>
                Đổi ngay
              </button>
            </div>

            <div className="card-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🥩</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Đĩa Ba Chỉ Bò Mỹ</div>
                <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Cần: 35 Ớt Vàng</div>
              </div>
              <button style={{ padding: '8px 14px', borderRadius: '9999px', background: 'var(--gold-gradient)', border: 'none', fontWeight: 700, cursor: 'pointer' }} onClick={() => handleRedeem('Đĩa Ba Chỉ Bò Mỹ', 35)}>
                Đổi ngay
              </button>
            </div>

            <div className="card-box" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', marginBottom: '10px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🎟️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Giảm 50.000đ Vé Buffet</div>
                <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Cần: 70 Ớt Vàng</div>
              </div>
              <button style={{ padding: '8px 14px', borderRadius: '9999px', background: 'var(--gold-gradient)', border: 'none', fontWeight: 700, cursor: 'pointer' }} onClick={() => handleRedeem('Giảm 50k Vé Buffet', 70)}>
                Đổi ngay
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="bottom-bar">
        <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={20} />
          <span>Trang chủ</span>
        </button>
        <button className={`nav-btn ${activeTab === 'booking' ? 'active' : ''}`} onClick={() => setActiveTab('booking')}>
          <Calendar size={20} />
          <span>Đặt bàn</span>
        </button>
        <button className={`nav-btn ${activeTab === 'gacha' ? 'active' : ''}`} onClick={() => setActiveTab('gacha')}>
          <Gift size={20} />
          <span>Blind Box</span>
        </button>
        <button className={`nav-btn ${activeTab === 'album' ? 'active' : ''}`} onClick={() => setActiveTab('album')}>
          <BookOpen size={20} />
          <span>Sổ Vịt</span>
        </button>
        <button className={`nav-btn ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>
          <Ticket size={20} />
          <span>Ví Ớt</span>
        </button>
      </nav>

      {/* Modal Duck Unlocked */}
      {unlockedDuck && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ fontSize: '32px' }}>🎉</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>CHÚC MỪNG BẠN!</h3>
            <p style={{ fontSize: '13px', color: 'var(--wood-medium)' }}>Bạn vừa mở trúng:</p>

            <div style={{
              width: 130, height: 130, margin: '14px auto', borderRadius: 20, overflow: 'hidden',
              background: 'var(--gold-light)', border: '3px solid var(--gold-accent)'
            }}>
              <img src={unlockedDuck.image} alt={unlockedDuck.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--red-primary)' }}>{unlockedDuck.name}</h4>
            <p style={{ fontSize: '12px', color: 'var(--wood-medium)', margin: '6px 0 16px 0' }}>
              Đã lưu vào Sổ Sưu Tập Vịt Vàng của bạn!
            </p>

            <button className="btn-pill btn-red" onClick={() => { setUnlockedDuck(null); setActiveTab('album'); }}>
              Xem trong Sổ Vịt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
