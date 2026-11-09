import type { Branch } from '../types';

export const BRANCHES: Branch[] = [
  // --- TP. HỒ CHÍ MINH (MIỀN NAM) ---
  { id: 'thaodien', name: 'Spicy Box Vincom Thảo Điền', mall: 'Tầng 4, Vincom Mega Mall Thảo Điền', address: '161 Xa Lộ Hà Nội, P. Thảo Điền', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3620 9099' },
  { id: 'saigoncentre', name: 'Spicy Box Saigon Centre', mall: 'Tầng B2, Saigon Centre', address: '65 Lê Lợi, P. Bến Nghé, Quận 1', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3821 1122' },
  { id: 'vanhanh', name: 'Spicy Box Vạn Hạnh Mall', mall: 'Tầng B, Vạn Hạnh Mall', address: '11 Sư Vạn Hạnh, Phường 12, Quận 10', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3862 8899' },
  { id: 'gigamall', name: 'Spicy Box Gigamall', mall: 'Tầng 5, TTTM Gigamall', address: '240-242 Phạm Văn Đồng, P. Hiệp Bình Chánh', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3636 5588' },
  { id: 'crescent', name: 'Spicy Box Crescent Mall', mall: 'Tầng 5, Crescent Mall', address: '101 Tôn Dật Tiên, P. Tân Phú, Quận 7', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 5413 7799' },
  { id: 'aeontanphu', name: 'Spicy Box AEON Mall Tân Phú', mall: 'Tầng 3, AEON Mall Tân Phú Celadon', address: '30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 6288 7733' },
  { id: 'estella', name: 'Spicy Box Estella Place', mall: 'Tầng 4, Estella Place', address: '88 Song Hành, P. An Phú, TP. Thủ Đức', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3636 3311' },
  { id: 'gonguyenthithap', name: 'Spicy Box GO! Nguyễn Thị Thập', mall: 'Tầng 2, GO! Nguyễn Thị Thập', address: '99 Nguyễn Thị Thập, P. Tân Phú, Quận 7', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3775 6677' },
  { id: 'parcmall', name: 'Spicy Box Parcmall', mall: 'Tầng 4, TTTM Parcmall', address: '547 Tạ Quang Bửu, Phường 4, Quận 8', city: 'TP. Hồ Chí Minh', region: 'Miền Nam', hotline: '028 3850 4488' },

  // --- HÀ NỘI & HẢI PHÒNG (MIỀN BẮC) ---
  { id: 'lottewestlake', name: 'Spicy Box Lotte Mall Tây Hồ', mall: 'Tầng 3, Lotte Mall West Lake', address: '272 Võ Chí Công, P. Phú Thượng, Q. Tây Hồ', city: 'Hà Nội', region: 'Miền Bắc', hotline: '024 3333 8899' },
  { id: 'aeonhadong', name: 'Spicy Box AEON Mall Hà Đông', mall: 'Tầng 2, AEON Mall Hà Đông', address: 'Khu dân cư Hoàng Văn Thụ, P. Dương Nội, Q. Hà Đông', city: 'Hà Nội', region: 'Miền Bắc', hotline: '024 3765 4422' },
  { id: 'aeonlechan', name: 'Spicy Box AEON Mall Hải Phòng Lê Chân', mall: 'Tầng 1, AEON Mall Hải Phòng Lê Chân', address: '10 Võ Nguyên Giáp, P. Kênh Dương, Q. Lê Chân', city: 'Hải Phòng', region: 'Miền Bắc', hotline: '0225 355 6688' },

  // --- ĐÀ NẴNG, HUẾ & NHA TRANG (MIỀN TRUNG) ---
  { id: 'aeondanang', name: 'Spicy Box AEON Mall Thanh Khê', mall: 'Tầng 3, AEON Mall Thanh Khê', address: '46 Điện Biên Phủ, P. Chính Gián, Q. Thanh Khê', city: 'Đà Nẵng', region: 'Miền Trung', hotline: '0236 388 9922' },
  { id: 'lottedanang', name: 'Spicy Box Lotte Mart Đà Nẵng', mall: 'Tầng 2 (2F-28), Lotte Mart Đà Nẵng', address: '06 Nại Nam, P. Hòa Cường Bắc, Q. Hải Châu', city: 'Đà Nẵng', region: 'Miền Trung', hotline: '0236 361 1155' },
  { id: 'aeonhue', name: 'Spicy Box AEON Mall Huế', mall: 'Tầng 1, TTTM AEON Mall Huế', address: '8 Võ Nguyên Giáp, P. An Đông', city: 'Huế', region: 'Miền Trung', hotline: '0234 388 6699' },
  { id: 'gonhatrang', name: 'Spicy Box GO! Nha Trang', mall: 'Tầng 1, TTTM GO! Nha Trang', address: 'Lô 4, Đường 19/5, KĐT Vĩnh Điềm Trung', city: 'Nha Trang', region: 'Miền Trung', hotline: '0258 389 4488' },

  // --- BÌNH DƯƠNG & ĐỒNG NAI (ĐÔNG NAM BỘ) ---
  { id: 'aeonbinhduong', name: 'Spicy Box AEON Mall Canary', mall: 'Tầng 1, AEON Mall Bình Dương Canary', address: '01 Đại lộ Bình Dương, Thuận Giao, TP. Thuận An', city: 'Bình Dương', region: 'Miền Nam', hotline: '0274 625 9933' },
  { id: 'godian', name: 'Spicy Box GO! Dĩ An', mall: 'Tầng trệt, TTTM GO! Dĩ An', address: 'Quốc lộ 1K, P. Đông Hòa, TP. Dĩ An', city: 'Bình Dương', region: 'Miền Nam', hotline: '0274 377 8822' },
  { id: 'coopbienhoa', name: 'Spicy Box Co.opmart Biên Hòa', mall: 'Tầng 2, Co.opmart Biên Hòa', address: '121 Phạm Văn Thuận, P. Thống Nhất, TP. Biên Hòa', city: 'Đồng Nai', region: 'Miền Nam', hotline: '0251 382 7799' },

  // --- CẦN THƠ & MIỀN TÂY ---
  { id: 'sensecitycantho', name: 'Spicy Box Sense City Cần Thơ', mall: 'Tầng 2 (L2-011), TTTM Sense City', address: '01 Đại lộ Hòa Bình, P. Tân An, Q. Ninh Kiều', city: 'Cần Thơ', region: 'Miền Tây', hotline: '0292 368 8899' },
];

export const CITIES = [
  'Tất cả',
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Hải Phòng',
  'Huế',
  'Nha Trang',
  'Bình Dương',
  'Đồng Nai',
  'Cần Thơ'
] as const;

export const ADULT_PRICE = 129000;
export const CHILD_PRICE = 79000;

export const PAYMENT_METHODS = [
  { id: 'vietqr', name: 'VietQR / Ngân hàng (Miễn phí)', desc: 'Quét mã VietQR bằng mọi app ngân hàng', icon: '🏦', badge: 'Khuyên dùng' },
  { id: 'momo', name: 'Ví điện tử MoMo', desc: 'Quét QR hoặc thanh toán 1 chạm MoMo', icon: '🟣', badge: 'Ưu đãi' },
  { id: 'zalopay', name: 'Ví ZaloPay', desc: 'Mở app ZaloPay xác nhận thanh toán', icon: '🟢' },
  { id: 'card', name: 'Thẻ ATM / Visa / Mastercard', desc: 'Cổng thanh toán thẻ an toàn bảo mật', icon: '💳' },
];

export const SPICY_LEVELS = [
  { key: 'mild', label: '🌶️ Cay nhẹ', desc: 'Hơi tê tê nhẹ' },
  { key: 'medium', label: '🌶️🌶️ Cay vừa', desc: 'Chuẩn Hàn Quốc' },
  { key: 'hot', label: '🌶️🌶️🌶️ Cực cay', desc: 'Dành cho chiến binh' },
];

const today = new Date();
export const DATES = Array.from({ length: 5 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  return {
    label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : d.toLocaleDateString('vi-VN', { weekday: 'short' }),
    day: `${d.getDate()}/${d.getMonth() + 1}`,
    key: d.toISOString().slice(0, 10),
  };
});

export const ALL_SLOTS = [
  '09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30',
  '21:00','21:30','22:00',
];

export const SESSION_SLOTS: { label: string; emoji: string; slots: string[] }[] = [
  { label: 'Buổi sáng', emoji: '🌅', slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 9 && h < 12; }) },
  { label: 'Buổi trưa',  emoji: '☀️',  slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 12 && h < 15; }) },
  { label: 'Buổi chiều', emoji: '🌤️', slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 15 && h < 18; }) },
  { label: 'Buổi tối',   emoji: '🌙', slots: ALL_SLOTS.filter(s => { const h = parseInt(s); return h >= 18; }) },
];

// Bàn sinh nhật: mỗi suất kéo dài 2 tiếng, bắt đầu từ 09:00 (09:00 - 11:00, 11:00 - 13:00,...)
export const BIRTHDAY_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];

export function getBirthdayEndTime(slot: string): string {
  const [h, m] = slot.split(':').map(Number);
  const endH = h + 2;
  return `${endH < 10 ? '0' : ''}${endH}:${m < 10 ? '0' : ''}${m || 0}`;
}
