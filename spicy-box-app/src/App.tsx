import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { Season, Mascot, Branch, UserProfile, ActiveTab } from './types';
import { BRANCHES } from './data/constants';
import { INITIAL_MASCOTS } from './data/mascots';

// Layout & Modals
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { BranchModal } from './components/branch/BranchModal';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { AuthModal } from './components/auth/AuthModal';

// Tabs
import { HomeTab } from './components/tabs/HomeTab';
import { BookingTab } from './components/tabs/BookingTab';
import { MenuTab } from './components/tabs/MenuTab';
import { AlbumTab } from './components/tabs/AlbumTab';
import { RewardsTab } from './components/tabs/RewardsTab';

export function App() {
  const [currentSeason, setCurrentSeason] = useState<Season>('HALLOWEEN');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [points, setPoints] = useState(120);

  // Hàng chờ: Khi vừa tạo tài khoản / chưa đặt bàn thì số của bạn là null, cửa hàng có thể chưa phục vụ hoặc đang phục vụ lượt A-12
  const [servingNum, setServingNum] = useState<number | null>(12);
  const [myNum, setMyNum] = useState<number | null>(() => {
    const saved = localStorage.getItem('spicy_box_my_queue');
    return saved ? parseInt(saved, 10) : null;
  });

  const [mascots] = useState<Mascot[]>(INITIAL_MASCOTS);

  // User Authentication state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('spicy_box_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return null;
  });
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Branch state: mặc định không khóa vào Vincom Thảo Điền nếu chưa từng chọn
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(() => {
    const saved = localStorage.getItem('spicy_box_branch');
    if (saved) {
      try {
        const found = BRANCHES.find(b => b.id === saved);
        if (found) return found;
      } catch (e) {
        /* ignore */
      }
    }
    return null;
  });
  const [showBranchModal, setShowBranchModal] = useState(false);

  // Tự động nhắc chọn chi nhánh khi đăng nhập hoặc vào app lần đầu mà chưa có chi nhánh
  useEffect(() => {
    if ((user || isGuest) && !selectedBranch) {
      const timer = setTimeout(() => {
        setShowBranchModal(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, isGuest, selectedBranch]);

  // Auto-login via QR code scan (?autologin=true hoặc ?name=...&phone=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autologin') === 'true' || params.has('guest') || params.has('qr')) {
        const qrUser: UserProfile = {
          name: params.get('name') || 'Khách Quét QR',
          phone: params.get('phone') || '0988 888 888',
          memberCode: `SPB-${Math.floor(10000 + Math.random() * 90000)}`,
          tier: 'GOLD VIP',
          points: 120,
        };
        setUser(qrUser);
        setPoints(120);
        localStorage.setItem('spicy_box_user', JSON.stringify(qrUser));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    localStorage.setItem('spicy_box_branch', branch.id);
    setShowBranchModal(false);
    // Khi đổi chi nhánh thì reset tình trạng phục vụ mẫu của cơ sở đó
    setServingNum(15);
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất tài khoản?')) {
      setUser(null);
      setIsGuest(false);
      localStorage.removeItem('spicy_box_user');
      localStorage.removeItem('spicy_box_branch');
      localStorage.removeItem('spicy_box_my_queue');
      setSelectedBranch(null);
      setMyNum(null);
      alert('Đã đăng xuất tài khoản thành công.');
    }
  };

  const handleRedeem = (title: string, cost: number) => {
    if (points < cost) {
      alert('Bạn không đủ Ớt Vàng để đổi ưu đãi này!');
      return;
    }
    setPoints(prev => prev - cost);
    alert(`Đổi thành công: ${title}! (-${cost} Ớt Vàng). Mã QR đã sẵn sàng trong ví.`);
  };

  const seasonMascots = mascots.filter(m => m.season === currentSeason);
  const unlockedCount = seasonMascots.filter(m => m.isUnlocked).length;

  return (
    <div className="device-wrapper">
      {/* MÀN HÌNH CHÀO MỪNG NẾU CHƯA ĐĂNG NHẬP VÀ CHƯA CHỌN KHÁCH VÃNG LAI */}
      {!user && !isGuest ? (
        <WelcomeScreen
          onLoginSuccess={loggedInUser => {
            setUser(loggedInUser);
            setPoints(loggedInUser.points || 10);
          }}
          onContinueAsGuest={() => setIsGuest(true)}
        />
      ) : (
        <>
          <Header
            selectedBranch={selectedBranch}
            user={user}
            points={points}
            onOpenBranchModal={() => setShowBranchModal(true)}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onNavigateRewards={() => setActiveTab('rewards')}
          />

          <main className="main-viewport">
            {activeTab === 'home' && (
              <HomeTab
                currentSeason={currentSeason}
                selectedBranch={selectedBranch}
                servingNum={servingNum}
                myNum={myNum}
                unlockedCount={unlockedCount}
                onOpenBranchModal={() => setShowBranchModal(true)}
                onNavigateTab={tab => setActiveTab(tab)}
              />
            )}

            {activeTab === 'booking' && (
              <BookingTab
                selectedBranch={selectedBranch}
                onOpenBranchModal={() => setShowBranchModal(true)}
                onBookingComplete={(pointsEarned, _boxesEarned, assignedNum) => {
                  setPoints(prev => {
                    const newPoints = prev + pointsEarned;
                    return newPoints;
                  });
                  setMyNum(assignedNum);
                  localStorage.setItem('spicy_box_my_queue', assignedNum.toString());

                  // Lưu số lần khách đặt bàn / dùng bữa và điểm tích luỹ
                  if (user) {
                    const updatedUser = {
                      ...user,
                      points: (user.points || 0) + pointsEarned,
                      bookingCount: (user.bookingCount || 0) + 1,
                    };
                    setUser(updatedUser);
                    localStorage.setItem('spicy_box_user', JSON.stringify(updatedUser));

                    if (supabase) {
                      supabase
                        .from('users')
                        .update({
                          points_balance: updatedUser.points,
                          booking_count: updatedUser.bookingCount,
                        })
                        .eq('phone', user.phone)
                        .then(() => {});
                    }
                  }
                }}
                onNavigateTab={tab => setActiveTab(tab)}
              />
            )}

            {activeTab === 'menu' && (
              <MenuTab onNavigateTab={tab => setActiveTab(tab)} />
            )}

            {activeTab === 'album' && (
              <AlbumTab
                currentSeason={currentSeason}
                onSeasonChange={season => setCurrentSeason(season)}
                mascots={mascots}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsTab
                user={user}
                points={points}
                onLogout={handleLogout}
                onOpenAuthModal={() => setShowAuthModal(true)}
                onRedeemReward={handleRedeem}
              />
            )}
          </main>

          <BottomNav activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />

          <BranchModal
            isOpen={showBranchModal}
            onClose={() => setShowBranchModal(false)}
            selectedBranch={selectedBranch}
            onSelectBranch={handleSelectBranch}
          />

          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={loggedInUser => {
              setUser(loggedInUser);
              setPoints(loggedInUser.points || 10);
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
