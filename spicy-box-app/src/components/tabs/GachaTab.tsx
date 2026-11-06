import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Mascot } from '../../types';

interface GachaTabProps {
  availableBoxes: number;
  onOpenBox: () => void;
  unlockedDuck: Mascot | null;
  onCloseDuckModal: () => void;
  onViewAlbum: () => void;
}

export const GachaTab: React.FC<GachaTabProps> = ({
  availableBoxes,
  onOpenBox,
  unlockedDuck,
  onViewAlbum,
}) => {
  return (
    <>
      <div className="card-box" style={{ textAlign: 'center', padding: '28px 20px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--red-primary)',
            textTransform: 'uppercase',
          }}
        >
          Mỗi lần ăn lẩu • Nhận 1 hộp mù
        </span>
        <h3 style={{ fontSize: '20px', fontWeight: 700, margin: '6px 0 16px 0' }}>
          HỘP QUÀ VỊT VÀNG 3D
        </h3>

        <div
          style={{
            width: 170,
            height: 170,
            margin: '16px auto',
            background: 'linear-gradient(135deg, #C5221F 0%, #8E1614 100%)',
            borderRadius: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 36px rgba(197, 34, 31, 0.35)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={onOpenBox}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: 24,
              background: 'var(--gold-gradient)',
            }}
          ></div>
          <div style={{ fontSize: '44px', zIndex: 2 }}>🎀</div>
          <img
            src="./assets/spicy-box-logo.png"
            alt="Spicy Box"
            style={{
              height: '28px',
              objectFit: 'contain',
              zIndex: 2,
              marginTop: '8px',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>

        <p style={{ fontSize: '13px', color: 'var(--wood-medium)', margin: '16px 0' }}>
          Bạn đang có:{' '}
          <strong style={{ color: 'var(--red-primary)', fontSize: '18px' }}>
            {availableBoxes}
          </strong>{' '}
          lượt mở hộp
        </p>

        <button className="btn-pill btn-gold" onClick={onOpenBox}>
          <Sparkles size={18} /> Chạm để mở Hộp Quà Bí Ẩn
        </button>
      </div>

      {/* Modal Duck Unlocked */}
      {unlockedDuck && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ fontSize: '32px' }}>🎉</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>CHÚC MỪNG BẠN!</h3>
            <p style={{ fontSize: '13px', color: 'var(--wood-medium)' }}>Bạn vừa mở trúng:</p>

            <div
              style={{
                width: 130,
                height: 130,
                margin: '14px auto',
                borderRadius: 20,
                overflow: 'hidden',
                background: 'var(--gold-light)',
                border: '3px solid var(--gold-accent)',
              }}
            >
              <img
                src={unlockedDuck.image}
                alt={unlockedDuck.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--red-primary)' }}>
              {unlockedDuck.name}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--wood-medium)', margin: '6px 0 16px 0' }}>
              Đã lưu vào Sổ Sưu Tập Vịt Vàng của bạn!
            </p>

            <button className="btn-pill btn-red" onClick={onViewAlbum}>
              Xem trong Sổ Vịt
            </button>
          </div>
        </div>
      )}
    </>
  );
};
