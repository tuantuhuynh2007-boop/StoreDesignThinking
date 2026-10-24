import { useState } from 'react';
import { Home, Calendar, Gift, BookOpen, Ticket, CheckCircle, Sparkles } from 'lucide-react';
import type { Season, Mascot } from './types';
import { INITIAL_MASCOTS } from './data/mascots';

export function App() {
  const [currentSeason, setCurrentSeason] = useState<Season>('HALLOWEEN');
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'gacha' | 'album' | 'rewards'>('home');
  const [points, setPoints] = useState(120);
  const [servingNum] = useState(18);
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
            <div className="card-box">
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Chọn ngày ăn lẩu:</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button style={{ padding: '8px 16px', borderRadius: '9999px', background: 'var(--wood-dark)', color: '#fff', border: 'none', fontWeight: 600 }}>Hôm nay (24/10)</button>
                <button style={{ padding: '8px 16px', borderRadius: '9999px', background: '#fff', border: '1px solid var(--wood-tint)', color: 'var(--wood-medium)' }}>Ngày mai (25/10)</button>
              </div>

              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Khung giờ đến:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <button style={{ padding: '8px 14px', borderRadius: '9999px', background: 'var(--red-primary)', color: '#fff', border: 'none', fontWeight: 600 }}>18:30 (Tối)</button>
                <button style={{ padding: '8px 14px', borderRadius: '9999px', background: '#fff', border: '1px solid var(--wood-tint)' }}>19:00</button>
                <button style={{ padding: '8px 14px', borderRadius: '9999px', background: '#fff', border: '1px solid var(--wood-tint)' }}>19:30</button>
              </div>

              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Số lượng khách:</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--wood-tint)' }}>
                <span>Vé Buffet Người Lớn</span>
                <strong style={{ fontSize: '16px' }}>4 người</strong>
              </div>

              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', margin: '14px 0 8px 0' }}>Vị sốt lẩu ưu tiên:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '8px 14px', borderRadius: '9999px', background: '#fff', border: '1px solid var(--wood-tint)' }}>🌶️ Cay vừa</button>
                <button style={{ padding: '8px 14px', borderRadius: '9999px', background: 'var(--wood-dark)', color: '#fff', border: 'none' }}>🌶️🌶️ Chuẩn Hàn</button>
              </div>
            </div>

            <button className="btn-pill btn-red" onClick={() => alert('Đặt bàn thành công! Mã QR của bạn: #SB-8991 đã được lưu vào ví.')}>
              Xác nhận đặt bàn & Nhận mã QR
            </button>
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
