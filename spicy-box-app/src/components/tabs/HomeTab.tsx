import React from 'react';
import { Calendar, Gift, BookOpen, Ticket, CheckCircle, MapPin } from 'lucide-react';
import type { Branch, Season, ActiveTab } from '../../types';

interface HomeTabProps {
  currentSeason: Season;
  selectedBranch: Branch;
  servingNum: number;
  myNum: number;
  unlockedCount: number;
  onOpenBranchModal: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  currentSeason,
  selectedBranch,
  servingNum,
  myNum,
  unlockedCount,
  onOpenBranchModal,
  onNavigateTab,
}) => {
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
    <div>
      {/* Season Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          border: '1px solid rgba(229, 169, 60, 0.4)',
          borderRadius: '22px',
          padding: '14px 18px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#B45309' }}>{banner.title}</h4>
          <p style={{ fontSize: '12px', color: '#92400E', marginTop: '2px' }}>{banner.sub}</p>
        </div>
        <span
          style={{
            background: '#EA580C',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          Live
        </span>
      </div>

      {/* Live Queue Card */}
      <div className="card-box" style={{ borderTop: '6px solid var(--red-primary)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--wood-medium)',
              textTransform: 'uppercase',
            }}
          >
            Hàng chờ trực tiếp
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--status-green)',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: 'var(--status-green)',
                borderRadius: '50%',
              }}
            ></span>
            Đang hoạt động
          </span>
        </div>

        {/* Chi nhánh hiện tại */}
        <div
          onClick={onOpenBranchModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--bg-surface-subtle)',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            color: 'var(--wood-dark)',
            fontWeight: 600,
            marginBottom: '10px',
            cursor: 'pointer',
            border: '1px solid var(--wood-tint)',
          }}
        >
          <MapPin size={12} color="var(--red-primary)" />
          <span>{selectedBranch.name}</span>
          <span style={{ color: 'var(--red-primary)', fontSize: '10px' }}>(Đổi)</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px 0 16px 0',
            borderBottom: '1px dashed var(--wood-light)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>ĐANG PHỤC VỤ</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--wood-dark)' }}>
              A-{servingNum}
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--wood-tint)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>SỐ CỦA BẠN</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--red-primary)' }}>
              A-{myNum}
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--wood-medium)',
            textAlign: 'center',
            margin: '14px 0',
          }}
        >
          ⏳ Còn <strong style={{ color: 'var(--red-primary)' }}>{myNum - servingNum} lượt nữa</strong> là đến bạn (~10 phút). Bạn có thể thong thả dạo TTTM!
        </p>

        <button
          className="btn-pill btn-red"
          onClick={() => alert('Hệ thống đã báo nhân viên bạn đang có mặt trước cửa Spicy Box!')}
        >
          <CheckCircle size={18} /> Tôi đã có mặt tại cửa quán
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Tiện ích nhanh</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div
          className="card-box"
          style={{ padding: '16px', cursor: 'pointer', margin: 0 }}
          onClick={() => onNavigateTab('booking')}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Calendar size={20} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>Đặt bàn tiệc</div>
          <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Không lo hết chỗ</div>
        </div>

        <div
          className="card-box"
          style={{ padding: '16px', cursor: 'pointer', margin: 0 }}
          onClick={() => onNavigateTab('gacha')}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Gift size={20} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>Mở Blind Box</div>
          <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Săn Vịt Vàng 3D</div>
        </div>

        <div
          className="card-box"
          style={{ padding: '16px', cursor: 'pointer', margin: 0 }}
          onClick={() => onNavigateTab('album')}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <BookOpen size={20} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>Sổ Vịt 4 Mùa</div>
          <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>{unlockedCount}/6 biểu cảm</div>
        </div>

        <div
          className="card-box"
          style={{ padding: '16px', cursor: 'pointer', margin: 0 }}
          onClick={() => onNavigateTab('rewards')}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Ticket size={20} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>Ví Ớt & Voucher</div>
          <div style={{ fontSize: '12px', color: 'var(--wood-medium)' }}>Đổi phô mai, bò Mỹ</div>
        </div>
      </div>
    </div>
  );
};
