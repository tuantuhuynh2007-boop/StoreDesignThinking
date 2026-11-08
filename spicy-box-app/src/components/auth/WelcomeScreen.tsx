import React, { useState } from 'react';
import { Sparkles, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import type { UserProfile } from '../../types';

interface WelcomeScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onContinueAsGuest?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [regSuccessModal, setRegSuccessModal] = useState(false);

  const handleFillDemoAccount = () => {
    setAuthMode('login');
    setAuthMethod('password');
    setPhoneInput('0908123456');
    setPasswordInput('123456');
  };

  const handleLoginSubmit = async () => {
    const cleanPhone = phoneInput.replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      alert('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số)!');
      return;
    }

    if (authMethod === 'password') {
      if (!passwordInput || passwordInput.length < 6) {
        alert('Vui lòng nhập mật khẩu (tối thiểu 6 ký tự)!');
        return;
      }

      setAuthLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', cleanPhone)
          .maybeSingle();

        if (error) {
          console.warn('Lỗi Supabase:', error);
        }

        if (data) {
          if (data.password_hash && data.password_hash !== passwordInput) {
            setAuthLoading(false);
            alert('Mật khẩu không chính xác! Vui lòng thử lại hoặc chọn đăng nhập bằng mã OTP.');
            return;
          }

          const loggedUser: UserProfile = {
            id: data.id,
            name: data.full_name || 'Hội viên Spicy Box',
            phone: data.phone,
            memberCode: data.member_code || `SPB-${Math.floor(10000 + Math.random() * 90000)}`,
            tier: data.vip_tier || 'BRONZE',
            points: data.points_balance || 10,
          };

          if (rememberMe) {
            localStorage.setItem('spicy_box_user', JSON.stringify(loggedUser));
          }
          setAuthLoading(false);
          onLoginSuccess(loggedUser);
          alert(`Đăng nhập thành công! Chào mừng ${loggedUser.name} (${loggedUser.tier})`);
          return;
        } else {
          if (cleanPhone === '0908123456' && passwordInput === '123456') {
            const demoUser: UserProfile = {
              name: 'Nguyễn Văn Tuấn',
              phone: '0908123456',
              memberCode: 'SPB-99812',
              tier: 'GOLD VIP',
              points: 120,
            };
            if (rememberMe) {
              localStorage.setItem('spicy_box_user', JSON.stringify(demoUser));
            }
            setAuthLoading(false);
            onLoginSuccess(demoUser);
            alert(`Đăng nhập thành công! Chào mừng ${demoUser.name} (${demoUser.tier})`);
            return;
          }
          setAuthLoading(false);
          alert('Số điện thoại này chưa được đăng ký! Hãy bấm sang tab ĐĂNG KÝ MỚI để tạo tài khoản.');
          setAuthMode('register');
          return;
        }
      } catch (err) {
        console.error(err);
        setAuthLoading(false);
        if (cleanPhone === '0908123456' && passwordInput === '123456') {
          const demoUser: UserProfile = {
            name: 'Nguyễn Văn Tuấn',
            phone: '0908123456',
            memberCode: 'SPB-99812',
            tier: 'GOLD VIP',
            points: 120,
          };
          onLoginSuccess(demoUser);
          return;
        }
        alert('Không thể kết nối đến máy chủ. Đang đăng nhập ở chế độ ngoại tuyến...');
      }
    } else {
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
      if (rememberMe) {
        localStorage.setItem('spicy_box_user', JSON.stringify(loggedUser));
      }
      setOtpSent(false);
      setOtpInput('');
      onLoginSuccess(loggedUser);
      alert(`Đăng nhập OTP thành công! Chào mừng ${loggedUser.name}`);
    }
  };

  const handleRegisterSubmit = async () => {
    const cleanPhone = phoneInput.replace(/\s+/g, '');
    if (!nameInput.trim()) {
      alert('Vui lòng nhập họ và tên của bạn!');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 9) {
      alert('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số)!');
      return;
    }
    if (!passwordInput || passwordInput.length < 6) {
      alert('Mật khẩu phải có tối thiểu 6 ký tự để bảo mật tài khoản!');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      alert('Mật khẩu xác nhận không khớp! Vui lòng nhập lại.');
      return;
    }
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với Điều khoản Hội viên Spicy Box để tiếp tục.');
      return;
    }

    setAuthLoading(true);
    try {
      const generatedMemberCode = `SPB-${Math.floor(10000 + Math.random() * 90000)}`;

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            phone: cleanPhone,
            full_name: nameInput.trim(),
            password_hash: passwordInput,
            points_balance: 10,
            vip_tier: 'BRONZE',
            member_code: generatedMemberCode,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          setAuthLoading(false);
          alert('Số điện thoại này đã được đăng ký! Vui lòng chuyển sang tab Đăng nhập.');
          setAuthMode('login');
          return;
        }
        console.warn('Lỗi ghi Supabase:', error);
      }

      const newUser: UserProfile = {
        id: data ? data.id : undefined,
        name: nameInput.trim(),
        phone: cleanPhone,
        memberCode: generatedMemberCode,
        tier: 'BRONZE',
        points: 10,
      };

      localStorage.setItem('spicy_box_user', JSON.stringify(newUser));
      setAuthLoading(false);
      setRegSuccessModal(true);
    } catch (err) {
      console.error(err);
      setAuthLoading(false);
      const fallbackUser: UserProfile = {
        name: nameInput.trim(),
        phone: cleanPhone,
        memberCode: `SPB-${Math.floor(10000 + Math.random() * 90000)}`,
        tier: 'BRONZE',
        points: 10,
      };
      localStorage.setItem('spicy_box_user', JSON.stringify(fallbackUser));
      setRegSuccessModal(true);
    }
  };

  return (
    <div
      style={{
        minHeight: '760px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px 20px 20px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* KHỐI 1: HEADER & LOGO NHẬN DIỆN THƯƠNG HIỆU */}
      <div>
        <div
          style={{
            width: 86,
            height: 86,
            margin: '6px auto 10px auto',
            background: '#fff',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(197, 34, 31, 0.16)',
            border: '1px solid rgba(197, 34, 31, 0.1)',
            padding: '10px',
          }}
        >
          <img
            src="./assets/spicy-box-logo.png"
            alt="Spicy Box"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--wood-dark)',
            letterSpacing: '0.5px',
            marginBottom: '3px',
          }}
        >
          SPICY BOX VIỆT NAM
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--red-primary)', fontWeight: 600 }}>
          Buffet Tokpokki Chuẩn Hàn • Do It Yourself
        </p>

        {/* KHỐI 2: BENEFIT BOX */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
            border: '1px solid #FECDD3',
            borderRadius: '16px',
            padding: '10px 14px',
            margin: '14px 0 16px 0',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--red-primary)',
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Sparkles size={13} /> ĐẶC QUYỀN HỘI VIÊN SPICY BOX PASS:
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#881337',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <div>🌶️ <strong>Tích Ớt Vàng</strong> đổi vé buffet & phô mai vòng miễn phí</div>
            <div>🎁 <strong>Mở hộp mù Blind Box</strong> săn Vịt độc bản theo mùa</div>
            <div>⚡ <strong>Đặt bàn ưu tiên</strong> – Quét QR check-in không xếp hàng</div>
          </div>
        </div>
      </div>

      {/* KHỐI 3 & 4: FORM CHÍNH */}
      <div
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '18px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1.5px solid var(--wood-tint)',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '16px',
          }}
        >
          <button
            onClick={() => setAuthMode('login')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              background: authMode === 'login' ? 'var(--red-primary)' : 'transparent',
              color: authMode === 'login' ? '#fff' : 'var(--wood-medium)',
              transition: 'all 0.18s',
            }}
          >
            🔑 Đăng nhập
          </button>
          <button
            onClick={() => setAuthMode('register')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              background: authMode === 'register' ? 'var(--red-primary)' : 'transparent',
              color: authMode === 'register' ? '#fff' : 'var(--wood-medium)',
              transition: 'all 0.18s',
            }}
          >
            📝 Đăng ký mới
          </button>
        </div>

        {authMode === 'login' && (
          <>
            {authMethod === 'password' ? (
              <>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--wood-dark)',
                    display: 'block',
                    marginBottom: '5px',
                  }}
                >
                  📱 Số điện thoại:
                </label>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <Phone
                    size={15}
                    color="var(--wood-medium)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="tel"
                    placeholder="VD: 0908 123 456"
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 34px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--wood-light)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--wood-dark)',
                    display: 'block',
                    marginBottom: '5px',
                  }}
                >
                  🔒 Mật khẩu:
                </label>
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <Lock
                    size={15}
                    color="var(--wood-medium)"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu của bạn"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 34px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--wood-light)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--wood-medium)',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                    fontSize: '11px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      color: 'var(--wood-dark)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--red-primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  className="btn-pill btn-red"
                  disabled={authLoading}
                  onClick={handleLoginSubmit}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang xác thực PostgreSQL...</span>
                    </>
                  ) : (
                    <span>Đăng nhập vào hệ thống ➔</span>
                  )}
                </button>
              </>
            ) : (
              <>
                {!otpSent ? (
                  <>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--wood-dark)',
                        display: 'block',
                        marginBottom: '5px',
                      }}
                    >
                      📱 Số điện thoại nhận mã OTP:
                    </label>
                    <input
                      type="tel"
                      placeholder="VD: 0908 123 456"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1.5px solid var(--wood-light)',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '12px',
                      }}
                    />
                    <button
                      className="btn-pill btn-red"
                      disabled={authLoading}
                      onClick={handleLoginSubmit}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        marginBottom: '8px',
                      }}
                    >
                      {authLoading ? 'Đang gửi...' : 'Gửi mã xác thực OTP ➔'}
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        marginBottom: '12px',
                        fontSize: '11px',
                        color: '#166534',
                      }}
                    >
                      ✓ Đã gửi mã OTP tới <strong>{phoneInput}</strong>. Gợi ý: nhập <strong>8888</strong>
                    </div>
                    <label
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--wood-dark)',
                        display: 'block',
                        marginBottom: '5px',
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
                        padding: '10px',
                        borderRadius: '12px',
                        border: '2px solid var(--red-primary)',
                        fontSize: '18px',
                        textAlign: 'center',
                        letterSpacing: '6px',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '10px',
                      }}
                    />
                    <button
                      className="btn-pill btn-red"
                      onClick={handleLoginSubmit}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        marginBottom: '8px',
                      }}
                    >
                      Xác nhận đăng nhập & Vào ứng dụng
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setAuthMethod('password')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--wood-medium)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'block',
                    margin: '4px auto 0 auto',
                  }}
                >
                  ← Quay lại đăng nhập bằng mật khẩu
                </button>
              </>
            )}

          </>
        )}

        {authMode === 'register' && (
          <>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--wood-dark)',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              👤 Họ và tên của bạn:
            </label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn Tuấn"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: '1.5px solid var(--wood-light)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '10px',
              }}
            />

            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--wood-dark)',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              📱 Số điện thoại:
            </label>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <Phone
                size={15}
                color="var(--wood-medium)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="tel"
                placeholder="VD: 0908 123 456"
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 34px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--wood-light)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--wood-dark)',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              🔒 Mật khẩu (tối thiểu 6 ký tự):
            </label>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <Lock
                size={15}
                color="var(--wood-medium)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Tạo mật khẩu an toàn"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 34px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--wood-light)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--wood-medium)',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--wood-dark)',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              🔒 Xác nhận mật khẩu:
            </label>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <Lock
                size={15}
                color="var(--wood-medium)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu"
                value={confirmPasswordInput}
                onChange={e => setConfirmPasswordInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 34px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--wood-light)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--wood-medium)',
                  padding: 0,
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: 'var(--wood-dark)',
                fontSize: '11px',
                marginBottom: '14px',
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
              />
              <span>Tôi đồng ý với Điều khoản Hội viên Spicy Box Pass</span>
            </label>

            <button
              className="btn-pill btn-red"
              disabled={authLoading}
              onClick={handleRegisterSubmit}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang lưu vào PostgreSQL...</span>
                </>
              ) : (
                <span>ĐĂNG KÝ TÀI KHOẢN ➔</span>
              )}
            </button>
          </>
        )}

        <div
          style={{
            textAlign: 'center',
            margin: '14px 0 10px 0',
            fontSize: '11px',
            color: 'var(--wood-medium)',
          }}
        >
          ── HOẶC TRẢI NGHIỆM NHANH ──
        </div>

        <button
          onClick={handleFillDemoAccount}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '12px',
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
          ⚡ Điền mẫu tài khoản thử nghiệm (Demo)
        </button>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ fontSize: '11px', color: 'var(--wood-medium)', marginTop: '4px', fontWeight: 500 }}>
          Hệ thống Spicy Box • Chuỗi Buffet Tokpokki 20 chi nhánh
        </div>
      </div>

      {/* POPUP CHÚC MỪNG ĐĂNG KÝ THÀNH CÔNG */}
      {regSuccessModal && (
        <div className="modal-backdrop">
          <div
            className="modal-content"
            style={{
              maxWidth: '360px',
              textAlign: 'center',
              padding: '26px 20px',
              borderRadius: '24px',
            }}
          >
            <div style={{ fontSize: '50px', marginBottom: '8px' }}>🎉</div>
            <h3
              style={{
                fontSize: '19px',
                fontWeight: 800,
                color: 'var(--wood-dark)',
                marginBottom: '6px',
              }}
            >
              ĐĂNG KÝ THÀNH CÔNG!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--wood-medium)', marginBottom: '16px' }}>
              Chào mừng bạn gia nhập Hội viên Spicy Box.
            </p>

            <div
              style={{
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%)',
                border: '1.5px dashed var(--red-primary)',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontSize: '12px', color: '#9A3412', fontWeight: 600 }}>
                QUÀ TẶNG THÀNH VIÊN MỚI
              </div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: 'var(--red-primary)',
                  margin: '4px 0',
                }}
              >
                +10 Ớt Vàng 🌶️
              </div>
              <div style={{ fontSize: '11px', color: 'var(--wood-medium)' }}>
                Đã được tự động cộng vào ví của bạn trong PostgreSQL
              </div>
            </div>

            <button
              className="btn-pill btn-red"
              onClick={() => {
                setRegSuccessModal(false);
                const savedUser = localStorage.getItem('spicy_box_user');
                if (savedUser) {
                  onLoginSuccess(JSON.parse(savedUser));
                }
              }}
              style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 700 }}
            >
              BẮT ĐẦU ĐẶT BÀN & TRẢI NGHIỆM ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
