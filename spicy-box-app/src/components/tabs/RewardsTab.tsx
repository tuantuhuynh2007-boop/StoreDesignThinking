import React from 'react';
import { LogOut, LogIn } from 'lucide-react';
import type { UserProfile } from '../../types';

interface RewardsTabProps {
  user: UserProfile | null;
  points: number;
  onLogout: () => void;
  onOpenAuthModal: () => void;
  onRedeemReward: (title: string, cost: number) => void;
}

export const RewardsTab: React.FC<RewardsTabProps> = ({
  user,
  points,
  onLogout,
  onOpenAuthModal,
  onRedeemReward,
}) => {
  return (
    <div>
      {user ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #4A2E1B 0%, #2A170C 100%)',
            color: '#fff',
            borderRadius: '22px',
            padding: '20px',
            marginBottom: '18px',
            boxShadow: '0 10px 25px rgba(42, 23, 12, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--gold-accent)',
                border: '1px solid var(--gold-accent)',
                padding: '3px 10px',
                borderRadius: '9999px',
              }}
            >
              SPICY BOX {user.tier}
            </span>
            <button
              onClick={onLogout}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <LogOut size={12} /> Đăng xuất
            </button>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '12px' }}>{user.name}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>SĐT: {user.phone}</div>
          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '10px' }}>SỐ DƯ ĐIỂM:</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold-accent)' }}>
            {points} Ớt Vàng 🌶️
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '6px' }}>
            Mã thành viên: #{user.memberCode}
          </div>
          <div
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span>🍲 Số lần ăn lẩu tại Spicy Box:</span>
            <span style={{ fontWeight: 700, color: '#FDE047', fontSize: '14px' }}>
              {user.bookingCount || 0} lần
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#FCD34D', opacity: 0.9, marginTop: '4px' }}>
            ✨ Mỗi lần ăn tại Spicy Box nhận ngay +50 Ớt Vàng
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1.5px dashed #F59E0B',
            borderRadius: '22px',
            padding: '24px 18px',
            textAlign: 'center',
            marginBottom: '18px',
          }}
        >
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>🌶️</div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#B45309', marginBottom: '4px' }}>
            Bạn chưa đăng nhập tài khoản
          </h4>
          <p style={{ fontSize: '12px', color: '#92400E', marginBottom: '16px', lineHeight: 1.5 }}>
            Đăng nhập bằng số điện thoại để tích lũy <strong>Ớt Vàng</strong>, đổi món ngon miễn phí
            (Phô mai, Bò Mỹ) và nhận thông báo gọi số trực tiếp!
          </p>
          <button
            className="btn-pill btn-gold"
            onClick={onOpenAuthModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <LogIn size={16} /> Đăng nhập / Đăng ký ngay
          </button>
        </div>
      )}

      <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
        Ưu đãi đổi bằng Ớt Vàng
      </div>

      <div
        className="card-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--red-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          🧀
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Vòng Phô Mai Kéo Sợi</div>
          <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Cần: 50 Ớt Vàng</div>
        </div>
        <button
          style={{
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'var(--gold-gradient)',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => onRedeemReward('Vòng Phô Mai Kéo Sợi', 50)}
        >
          Đổi ngay
        </button>
      </div>

      <div
        className="card-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--red-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          🥩
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Đĩa Ba Chỉ Bò Mỹ</div>
          <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Cần: 35 Ớt Vàng</div>
        </div>
        <button
          style={{
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'var(--gold-gradient)',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => onRedeemReward('Đĩa Ba Chỉ Bò Mỹ', 35)}
        >
          Đổi ngay
        </button>
      </div>

      <div
        className="card-box"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--red-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          🎟️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Giảm 50.000đ Vé Buffet</div>
          <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>Cần: 70 Ớt Vàng</div>
        </div>
        <button
          style={{
            padding: '8px 14px',
            borderRadius: '9999px',
            background: 'var(--gold-gradient)',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => onRedeemReward('Giảm 50k Vé Buffet', 70)}
        >
          Đổi ngay
        </button>
      </div>
    </div>
  );
};
