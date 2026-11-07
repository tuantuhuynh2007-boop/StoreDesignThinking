import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
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
  const [isOpening, setIsOpening] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleStartOpening = () => {
    if (availableBoxes <= 0) {
      alert('Bạn đã hết lượt mở hộp! Hãy dùng bữa tại Spicy Box để nhận thêm lượt nhé.');
      return;
    }
    if (isOpening) return;

    setIsOpening(true);
    setCountdown(5);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isOpening && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isOpening && countdown === 0) {
      setIsOpening(false);
      onOpenBox();
    }
    return () => clearTimeout(timer);
  }, [isOpening, countdown, onOpenBox]);

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
          className={isOpening ? 'box-shaking' : ''}
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
            cursor: isOpening ? 'wait' : 'pointer',
            position: 'relative',
            transition: 'transform 0.2s',
          }}
          onClick={handleStartOpening}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: 24,
              background: 'var(--gold-gradient)',
            }}
          ></div>
          <div style={{ fontSize: isOpening ? '52px' : '44px', zIndex: 2, transition: 'all 0.3s' }}>
            {isOpening ? '🎁' : '🎀'}
          </div>
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

        {isOpening ? (
          <div style={{ margin: '14px 0' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 size={18} className="animate-spin" />
              <span>Đang mở Hộp Mù... {countdown}s</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--wood-medium)', marginTop: '4px' }}>
              Đang quay thưởng với các tỷ lệ ngẫu nhiên 5% - 30%...
            </p>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: 'var(--wood-medium)', margin: '16px 0' }}>
            Bạn đang có:{' '}
            <strong style={{ color: 'var(--red-primary)', fontSize: '18px' }}>
              {availableBoxes}
            </strong>{' '}
            lượt mở hộp
          </p>
        )}

        <button
          className="btn-pill btn-gold"
          onClick={handleStartOpening}
          disabled={isOpening}
          style={{ opacity: isOpening ? 0.7 : 1, cursor: isOpening ? 'wait' : 'pointer' }}
        >
          <Sparkles size={18} /> {isOpening ? `Đang mở bí mật (${countdown}s)...` : 'Chạm để mở Hộp Quà Bí Ẩn'}
        </button>

        {/* Bảng công khai tỷ lệ trúng Blind Box */}
        <div
          style={{
            marginTop: '20px',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--wood-tint)',
            borderRadius: '16px',
            padding: '12px 14px',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--wood-dark)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>🎲 Tỷ lệ xuất hiện Blind Box (6 mẫu Vịt):</span>
            <span style={{ color: 'var(--red-primary)', fontWeight: 800 }}>Ra trùng lặp</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: 'var(--wood-medium)' }}>
            <div>• Vui Vẻ: <strong style={{ color: 'var(--wood-dark)' }}>30%</strong></div>
            <div>• Chào Hỏi: <strong style={{ color: 'var(--wood-dark)' }}>25%</strong></div>
            <div>• Mếu Máo: <strong style={{ color: 'var(--wood-dark)' }}>15%</strong></div>
            <div>• Chu Mỏ Nháy Mắt: <strong style={{ color: 'var(--wood-dark)' }}>15%</strong></div>
            <div>• Ngạc Nhiên (Hiếm): <strong style={{ color: '#D97706' }}>10%</strong></div>
            <div>• Giận Dỗi (Secret): <strong style={{ color: 'var(--red-primary)' }}>5%</strong></div>
          </div>
        </div>
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
            <div
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                margin: '4px 0 8px 0',
                background: unlockedDuck.dropRate <= 5 ? '#FEE2E2' : unlockedDuck.dropRate <= 10 ? '#FEF3C7' : '#E0F2FE',
                color: unlockedDuck.dropRate <= 5 ? '#DC2626' : unlockedDuck.dropRate <= 10 ? '#D97706' : '#0284C7',
              }}
            >
              Tỷ lệ xuất hiện: {unlockedDuck.dropRate}% {unlockedDuck.dropRate <= 5 ? '★ Secret Siêu Hiếm' : unlockedDuck.dropRate <= 10 ? '★ Hiếm' : '✓ Phổ biến'}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--wood-medium)', margin: '4px 0 16px 0' }}>
              Số lượng đang có trong bộ sưu tập: <strong>{unlockedDuck.count} chú</strong>
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
