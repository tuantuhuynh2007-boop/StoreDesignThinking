import React from 'react';
import { MapPin, ChevronDown, LogIn } from 'lucide-react';
import type { Branch, UserProfile } from '../../types';

interface HeaderProps {
  selectedBranch: Branch | null;
  user: UserProfile | null;
  points: number;
  onOpenBranchModal: () => void;
  onOpenAuthModal: () => void;
  onNavigateRewards: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedBranch,
  user,
  points,
  onOpenBranchModal,
  onOpenAuthModal,
  onNavigateRewards,
}) => {
  return (
    <header className="top-header">
      <div className="brand-box">
        <img
          src="./assets/spicy-box-logo.png"
          alt="Spicy Box Logo"
          style={{ height: '38px', objectFit: 'contain' }}
        />
        <button
          onClick={onOpenBranchModal}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
          title="Nhấn để chọn chi nhánh ăn lẩu"
        >
          <div
            className="branch-text"
            style={{
              fontWeight: 600,
              color: selectedBranch ? 'var(--wood-dark)' : 'var(--red-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MapPin size={13} color="var(--red-primary)" />
            <span>
              {selectedBranch ? selectedBranch.name.replace('Spicy Box ', '') : 'Chọn chi nhánh'}
            </span>
            <ChevronDown size={13} color="var(--wood-medium)" />
          </div>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <div
            onClick={onNavigateRewards}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              padding: '5px 12px',
              borderRadius: '9999px',
              border: '1.5px solid var(--wood-tint)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            title="Nhấn để xem thẻ thành viên"
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--red-primary), var(--red-dark))',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--wood-dark)' }}>
              {user.name.split(' ').pop()}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--red-primary)', fontWeight: 700 }}>
              {points}🌶️
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, var(--red-primary) 0%, #981614 100%)',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(197, 34, 31, 0.25)',
            }}
          >
            <LogIn size={14} />
            <span>Đăng nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
