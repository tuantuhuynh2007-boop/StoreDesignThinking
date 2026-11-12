import React from 'react';
import type { Season, Mascot } from '../../types';

interface AlbumTabProps {
  currentSeason: Season;
  onSeasonChange: (season: Season) => void;
  mascots: Mascot[];
}

export const AlbumTab: React.FC<AlbumTabProps> = ({
  currentSeason,
  onSeasonChange,
  mascots,
}) => {
  const seasonMascots = mascots.filter(m => m.season === currentSeason);
  const unlockedCount = seasonMascots.filter(m => m.isUnlocked).length;

  return (
    <div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '14px' }}>
        Sổ Sưu Tập Vịt Vàng 4 Mùa
      </div>

      {/* Season Selector */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '12px',
        }}
      >
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            background: currentSeason === 'HALLOWEEN' ? 'var(--wood-dark)' : '#fff',
            color: currentSeason === 'HALLOWEEN' ? '#fff' : 'var(--wood-medium)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => onSeasonChange('HALLOWEEN')}
        >
          🎃 Halloween
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            background: currentSeason === 'CHRISTMAS' ? 'var(--wood-dark)' : '#fff',
            color: currentSeason === 'CHRISTMAS' ? '#fff' : 'var(--wood-medium)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => onSeasonChange('CHRISTMAS')}
        >
          ❄️ Giáng Sinh
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            background: currentSeason === 'TET' ? 'var(--wood-dark)' : '#fff',
            color: currentSeason === 'TET' ? '#fff' : 'var(--wood-medium)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => onSeasonChange('TET')}
        >
          🧧 Tết Nguyên Đán
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: 'none',
            background: currentSeason === 'MIDAUTUMN' ? 'var(--wood-dark)' : '#fff',
            color: currentSeason === 'MIDAUTUMN' ? '#fff' : 'var(--wood-medium)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => onSeasonChange('MIDAUTUMN')}
        >
          🥮 Trung Thu
        </button>
      </div>

      {/* Progress Card */}
      <div
        style={{
          background: 'var(--gold-light)',
          border: '1px solid var(--gold-accent)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '6px',
          }}
        >
          <span>Tiến độ mùa hiện tại</span>
          <span>{unlockedCount} / {seasonMascots.length} Vịt</span>
        </div>
        <div
          style={{
            width: '100%',
            height: 8,
            background: 'rgba(229, 169, 60, 0.3)',
            borderRadius: 99,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(unlockedCount / seasonMascots.length) * 100}%`,
              height: '100%',
              background: 'var(--gold-accent)',
              borderRadius: 99,
            }}
          ></div>
        </div>
        <p style={{ fontSize: '11px', color: '#92400E', marginTop: '6px' }}>
          ★ Gom đủ {seasonMascots.length}/{seasonMascots.length} biểu cảm để nhận <strong>01 Vòng Phô Mai Kéo Sợi</strong> miễn phí!
        </p>
      </div>

      {/* Ducks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {seasonMascots.map(duck => (
          <div
            key={duck.id}
            className="card-box"
            style={{
              padding: '12px',
              textAlign: 'center',
              margin: 0,
              opacity: duck.isUnlocked ? 1 : 0.6,
            }}
          >
            <div
              style={{
                width: '100%',
                height: 110,
                borderRadius: 14,
                background: '#F6F2EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: 8,
                position: 'relative',
              }}
            >
              <img
                src={duck.image}
                alt={duck.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: duck.isUnlocked ? 'none' : 'brightness(0) opacity(0.25)',
                }}
              />
              {!duck.isUnlocked && (
                <span
                  style={{
                    position: 'absolute',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--wood-medium)',
                  }}
                >
                  ?
                </span>
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
  );
};
