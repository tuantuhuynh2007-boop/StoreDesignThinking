import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoLogin = () => {
    const demoUser: UserProfile = {
      name: 'Nguyễn Văn Tuấn',
      phone: '0908 123 456',
      memberCode: 'SPB-99812',
      tier: 'GOLD VIP',
      points: 120,
    };
    onLoginSuccess(demoUser);
    localStorage.setItem('spicy_box_user', JSON.stringify(demoUser));
    onClose();
    setOtpSent(false);
    setPhoneInput('');
    alert('Đã đăng nhập thành công tài khoản: Nguyễn Văn Tuấn (GOLD VIP • 120 Ớt Vàng)!');
  };

  const handleLoginSubmit = () => {
    const cleanPhone = phoneInput.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      alert('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số)!');
      return;
    }

    if (!otpSent) {
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        setOtpSent(true);
      }, 500);
      return;
    }

    if (!otpInput || otpInput.trim() !== '8888') {
      alert('Mã OTP không chính xác! Hãy nhập mã OTP mẫu: 8888');
      return;
    }

    const loggedUser: UserProfile = {
      name: nameInput.trim() || `Khách hàng ${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      memberCode: `SPB-${Math.floor(10000 + Math.random() * 90000)}`,
      tier: 'BRONZE',
      points: 10,
    };
    localStorage.setItem('spicy_box_user', JSON.stringify(loggedUser));
    onLoginSuccess(loggedUser);
    onClose();
    setOtpSent(false);
    setOtpInput('');
    alert(`Đăng nhập OTP thành công! Chào mừng ${loggedUser.name}`);
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        style={{
          maxWidth: '380px',
          textAlign: 'left',
          position: 'relative',
          padding: '24px 20px',
        }}
      >
        <button
          onClick={() => {
            onClose();
            setOtpSent(false);
          }}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'var(--bg-surface-subtle)',
            border: 'none',
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--wood-dark)',
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src="./assets/spicy-box-logo.png"
            alt="Spicy Box"
            style={{ height: '52px', objectFit: 'contain', marginBottom: '4px' }}
          />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--wood-dark)' }}>
            ĐĂNG NHẬP THÀNH VIÊN
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--wood-medium)', marginTop: '2px' }}>
            Tích Ớt Vàng • Đổi quà Buffet • Săn Vịt Blind Box
          </p>
        </div>

        {!otpSent ? (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--wood-dark)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Họ và tên của bạn:
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn Tuấn"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--wood-light)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--wood-dark)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Số điện thoại di động:
              </label>
              <input
                type="tel"
                placeholder="VD: 0908 123 456"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--wood-light)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--wood-medium)',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                Hệ thống sẽ gửi mã OTP xác thực tới số này.
              </span>
            </div>

            <button
              className="btn-pill btn-red"
              disabled={authLoading}
              onClick={handleLoginSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang gửi mã OTP...</span>
                </>
              ) : (
                <span>Tiếp tục (Nhận mã OTP) ➔</span>
              )}
            </button>

            <div
              style={{
                textAlign: 'center',
                margin: '10px 0',
                fontSize: '11px',
                color: 'var(--wood-medium)',
              }}
            >
              ── HOẶC ──
            </div>

            <button
              onClick={handleQuickDemoLogin}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '9999px',
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                color: '#B45309',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              ⚡ Đăng nhập nhanh tài khoản mẫu (Demo)
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '14px',
                fontSize: '12px',
                color: '#166534',
              }}
            >
              ✓ Mã OTP gồm 4 chữ số đã gửi tới <strong>{phoneInput}</strong>.
              <div style={{ fontSize: '11px', color: '#15803D', marginTop: '3px' }}>
                💡 <em>Gợi ý thử nghiệm: Nhập mã OTP mẫu là <strong>8888</strong></em>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--wood-dark)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Nhập mã xác thực OTP (4 số):
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="8888"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid var(--red-primary)',
                  fontSize: '20px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontWeight: 700,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              className="btn-pill btn-red"
              onClick={handleLoginSubmit}
              style={{ marginBottom: '10px' }}
            >
              Xác nhận đăng nhập & Vào ứng dụng
            </button>

            <button
              onClick={() => setOtpSent(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--wood-medium)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'block',
                margin: '0 auto',
              }}
            >
              ← Đổi số điện thoại khác
            </button>
          </>
        )}
      </div>
    </div>
  );
};
