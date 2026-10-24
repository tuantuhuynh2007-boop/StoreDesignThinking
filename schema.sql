-- ====================================================================
-- SPICY BOX SMART WEB APP - DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ====================================================================

-- 1. BẢNG CHI NHÁNH QUÁN (STORES)
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,             -- VD: 'SPB-THAODIEN'
    name VARCHAR(100) NOT NULL,                    -- 'Spicy Box Vincom Thảo Điền'
    address TEXT NOT NULL,
    current_season VARCHAR(20) DEFAULT 'HALLOWEEN',-- 'HALLOWEEN', 'CHRISTMAS', 'TET', 'MIDAUTUMN'
    is_queue_open BOOLEAN DEFAULT true,            -- Tạm ngưng/Mở nhận hàng chờ
    max_queue_limit INT DEFAULT 50,                -- Giới hạn số lượng hàng chờ
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG NGƯỜI DÙNG & KHÁCH HÀNG (USERS)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_uuid VARCHAR(64) UNIQUE,                 -- Khách vãng lai quét QR dùng ngay
    phone VARCHAR(15) UNIQUE,                      -- Số điện thoại khi liên kết tài khoản
    full_name VARCHAR(100),
    points_balance INT DEFAULT 0,                  -- Số dư 'Ớt Vàng' tích lũy
    vip_tier VARCHAR(20) DEFAULT 'BRONZE',         -- 'BRONZE', 'SILVER', 'GOLD', 'DIAMOND'
    role VARCHAR(20) DEFAULT 'CUSTOMER',           -- 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN'
    password_hash TEXT,                            -- Dành cho Staff/Manager đăng nhập POS
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG HÀNG CHỜ THỜI GIAN THỰC (QUEUES)
CREATE TABLE queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    queue_number VARCHAR(10) NOT NULL,             -- VD: 'A-18', 'B-05' (Phân loại bàn)
    party_size INT NOT NULL DEFAULT 2,             -- Số lượng người
    table_type VARCHAR(20) DEFAULT 'STANDARD',     -- 'SMALL' (1-2), 'MEDIUM' (3-4), 'LARGE' (5+)
    status VARCHAR(20) DEFAULT 'WAITING',          -- 'WAITING', 'CALLED', 'SEATED', 'MISSED', 'CANCELLED'
    call_count INT DEFAULT 0,                      -- Số lần nhân viên đã bấm loa/chuông gọi
    created_at TIMESTAMPTZ DEFAULT NOW(),
    called_at TIMESTAMPTZ,
    seated_at TIMESTAMPTZ
);
CREATE INDEX idx_queues_store_status ON queues(store_id, status);

-- 4. BẢNG ĐẶT BÀN TRƯỚC (RESERVATIONS)
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    booking_code VARCHAR(15) UNIQUE NOT NULL,      -- Mã vé đặt chỗ, VD: 'SB-8821'
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    party_size_adult INT NOT NULL DEFAULT 2,
    party_size_child INT DEFAULT 0,
    spicy_preference VARCHAR(30) DEFAULT 'MEDIUM', -- 'MILD', 'MEDIUM', 'HOT'
    booking_date DATE NOT NULL,
    time_slot VARCHAR(10) NOT NULL,                -- '12:00', '18:30'
    status VARCHAR(20) DEFAULT 'PENDING',          -- 'PENDING', 'CONFIRMED', 'ARRIVED', 'CANCELLED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DANH MỤC 24 CHÚ VỊT VÀNG LINH VẬT THEO MÙA (MASCOTS)
CREATE TABLE mascots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season VARCHAR(20) NOT NULL,                   -- 'HALLOWEEN', 'CHRISTMAS', 'TET', 'MIDAUTUMN'
    emotion VARCHAR(30) NOT NULL,                  -- 'GIAN_DOI', 'CHAO_HOI', 'MEU_MAO', 'CHU_MO', 'NGAC_NHIEN', 'VUI_VE'
    name VARCHAR(100) NOT NULL,                    -- VD: 'Vịt Bí Ngô: Ngạc Nhiên'
    image_url TEXT NOT NULL,                       -- Đường dẫn file ảnh PNG độc lập
    rarity VARCHAR(20) DEFAULT 'COMMON',           -- 'COMMON', 'RARE', 'LEGENDARY'
    drop_rate NUMERIC(5,2) DEFAULT 16.66,          -- Tỷ lệ rơi (phần trăm %)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_season_emotion UNIQUE(season, emotion)
);

-- 6. SỔ SƯU TẬP CỦA KHÁCH HÀNG (USER_MASCOTS / INVENTORY)
CREATE TABLE user_mascots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mascot_id UUID NOT NULL REFERENCES mascots(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,                        -- Số lượng nhận (nếu mở trùng)
    first_unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    last_unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_mascot UNIQUE(user_id, mascot_id)
);

-- 7. KHO VOUCHER & QUÀ TẶNG (VOUCHERS)
CREATE TABLE vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id),
    title VARCHAR(150) NOT NULL,                   -- 'Vòng Phô Mai Kéo Sợi'
    description TEXT,
    cost_points INT NOT NULL,                      -- Số Ớt Vàng cần đổi (VD: 50)
    discount_type VARCHAR(20) NOT NULL,            -- 'ITEM', 'PERCENT', 'FIXED_AMOUNT'
    discount_value NUMERIC(10,2) DEFAULT 0,
    valid_days INT DEFAULT 30,                     -- Hạn dùng sau khi đổi
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VÍ VOUCHER CỦA NGƯỜI DÙNG (USER_VOUCHERS)
CREATE TABLE user_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voucher_id UUID NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    qr_token VARCHAR(64) UNIQUE NOT NULL,          -- Mã QR dùng 1 lần cho nhân viên quét
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TOKEN MỞ HỘP QUÀ CHỐNG GIAN LẬN (GACHA_TOKENS)
CREATE TABLE gacha_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    user_id UUID NOT NULL REFERENCES users(id),
    bill_code VARCHAR(50),                         -- Mã hóa đơn bàn ăn cấp lượt
    token_code VARCHAR(64) UNIQUE NOT NULL,        -- Token 1 lần
    is_claimed BOOLEAN DEFAULT false,              -- Đã mở hộp quà chưa
    created_at TIMESTAMPTZ DEFAULT NOW()
);
