import { useState } from 'react';
import { Home, Calendar, Gift, BookOpen, Ticket, CheckCircle, Sparkles, Plus, Minus } from 'lucide-react';
import type { Season, Mascot } from './types';
import { INITIAL_MASCOTS } from './data/mascots';

// ---- Booking helpers ----
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

  // Booking state
  const [selectedDate, setSelectedDate] = useState(DATES[0].key);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [spicyLevel, setSpicyLevel] = useState<string | null>(null);
  const [bookingDone, setBookingDone] = useState(false);
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
            <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>Đặt bàn trước Spicy Box</div>

            {bookingDone ? (
              /* ---- BOOKING SUCCESS SCREEN ---- */
              <div className="card-box" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-green)', marginBottom: '6px' }}>Đặt bàn thành công!</h3>
                <p style={{ fontSize: '13px', color: 'var(--wood-medium)', marginBottom: '20px' }}>
                  Mã đặt chỗ của bạn đã được lưu vào ví.
                </p>
                <div style={{ background: 'var(--bg-surface-subtle)', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Ngày đặt bàn:</span>
                    <strong style={{ fontSize: '13px' }}>{DATES.find(d => d.key === selectedDate)?.label} ({DATES.find(d => d.key === selectedDate)?.day})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Khung giờ:</span>
                    <strong style={{ fontSize: '13px' }}>{selectedSlot}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Số khách:</span>
                    <strong style={{ fontSize: '13px' }}>
                      {adultCount} người lớn{childCount > 0 ? ` + ${childCount} trẻ em` : ''}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Vị lẩu:</span>
                    <strong style={{ fontSize: '13px' }}>{SPICY_LEVELS.find(s => s.key === spicyLevel)?.label ?? '—'}</strong>
                  </div>
                </div>
                {/* QR placeholder */}
                <div style={{
                  width: 140, height: 140, margin: '0 auto 20px auto',
                  background: 'var(--wood-dark)', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '48px'
                }}>
                  📲
                </div>
                <p style={{ fontSize: '12px', color: 'var(--wood-medium)', marginBottom: '16px' }}>
                  Xuất trình mã QR này khi đến quán để nhân viên dẫn vào bàn.
                </p>
                <button className="btn-pill btn-outline" onClick={() => { setBookingDone(false); setSelectedSlot(null); setSpicyLevel(null); }}>
                  Đặt bàn lần khác
                </button>
              </div>
            ) : (
              /* ---- BOOKING FORM ---- */
              <>
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
                    2. Chọn khung giờ đến
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
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '14px', color: 'var(--wood-dark)' }}>
                    3. Số lượng vé Buffet
                  </label>

                  {/* Người lớn */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Người lớn</div>
                      <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Vé Buffet đầy đủ</div>
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
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>Trẻ em</div>
                      <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Dưới 10 tuổi</div>
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

                <button
                  className="btn-pill btn-red"
                  onClick={() => {
                    if (!selectedSlot) { alert('Vui lòng chọn khung giờ đến!'); return; }
                    if (!spicyLevel) { alert('Vui lòng chọn vị sốt lẩu!'); return; }
                    setBookingDone(true);
                  }}
                >
                  Xác nhận đặt bàn & Nhận mã QR
                </button>
              </>
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
