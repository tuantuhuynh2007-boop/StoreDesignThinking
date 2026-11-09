import React from 'react';
import { Home, Calendar, UtensilsCrossed, BookOpen, Ticket } from 'lucide-react';
import type { ActiveTab } from '../../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-bar">
      <button
        className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <Home size={20} />
        <span>Trang chủ</span>
      </button>
      <button
        className={`nav-btn ${activeTab === 'booking' ? 'active' : ''}`}
        onClick={() => onTabChange('booking')}
      >
        <Calendar size={20} />
        <span>Đặt bàn</span>
      </button>
      <button
        className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
        onClick={() => onTabChange('menu')}
      >
        <UtensilsCrossed size={20} />
        <span>Danh mục</span>
      </button>
      <button
        className={`nav-btn ${activeTab === 'album' ? 'active' : ''}`}
        onClick={() => onTabChange('album')}
      >
        <BookOpen size={20} />
        <span>Sổ Vịt</span>
      </button>
      <button
        className={`nav-btn ${activeTab === 'rewards' ? 'active' : ''}`}
        onClick={() => onTabChange('rewards')}
      >
        <Ticket size={20} />
        <span>Ví Ớt</span>
      </button>
    </nav>
  );
};
