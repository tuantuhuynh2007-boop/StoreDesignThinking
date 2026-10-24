# DESIGN SYSTEM & WIREFRAME: SPICY BOX SMART WEB APP
> **Phong cách:** Tối giản (Minimalism) • Mộc mạc ấm cúng (Japandi / Modern Asian)  
> **Bảng màu:** Trắng kem - Đỏ Spicy - Nâu gỗ sồi - Vàng hoàng kim  
> **Ngôn ngữ hình khối:** Bo tròn mềm mại (Soft Rounded & Pill buttons) • Chuyển động mượt mà (Smooth 60fps)

---

## 1. DESIGN TOKENS (HỆ THỐNG BIẾN THIẾT KẾ)

### A. Color Palette (Bảng màu)

```css
:root {
  /* --- MÀU NỀN & BỀ MẶT (BACKGROUND & SURFACE) --- */
  --color-bg-main: #FDFBF7;        /* Trắng kem ấm áp, không chói mắt */
  --color-surface-white: #FFFFFF;   /* Trắng tinh khôi cho các thẻ Card */
  --color-surface-subtle: #F6F2EA;  /* Nền phụ, các ô input nhẹ nhàng */
  
  /* --- MÀU GỖ SỒI TRẦM ẤM (WOOD TONES) --- */
  --color-wood-dark: #4A2E1B;      /* Nâu gỗ đậm: Màu chữ tiêu đề chính, icon quan trọng */
  --color-wood-medium: #7A5339;    /* Nâu gỗ vừa: Chữ nội dung phụ, viền thẻ */
  --color-wood-light: #CBB8A9;     /* Nâu be nhạt: Đường kẻ chia vạch (Dividers) */
  --color-wood-tint: #F3ECE5;      /* Nền chip tag nhẹ */

  /* --- MÀU ĐỎ SPICY BOX (PRIMARY RED) --- */
  --color-red-primary: #C5221F;    /* Đỏ ớt sốt Tokpokki đặc trưng của Spicy Box */
  --color-red-dark: #9B1614;       /* Đỏ đậm khi ấn nút (Active state) */
  --color-red-light: #FDE8E8;      /* Đỏ phấn nhạt: Nền thông báo, tag ưu đãi */

  /* --- MÀU VÀNG HOÀNG KIM (ACCENT GOLD) --- */
  --color-gold-accent: #E5A93C;    /* Vàng kim phô mai & ngôi sao điểm thưởng */
  --color-gold-light: #FEF7E6;     /* Nền vàng nhạt cho thẻ VIP, huy hiệu */
  --color-gold-gradient: linear-gradient(135deg, #F3C669 0%, #E5A93C 100%);

  /* --- MÀU HỆ THỐNG (STATUS) --- */
  --color-success: #2E7D32;        /* Xanh lá: Đã đến lượt bạn, bàn sẵn sàng */
  --color-warning: #ED6C02;        /* Cam: Chờ xác nhận, sắp hết hạn */
  --color-disabled: #D1C7BD;       /* Xám be: Nút chưa khả dụng */
}
```

### B. Typography (Hệ thống chữ)
Sử dụng Font chữ tròn trịa, hiện đại, hỗ trợ tiếng Việt hoàn hảo: **`Be Vietnam Pro`** hoặc **`Plus Jakarta Sans`**.

| Cấp bậc | Cỡ chữ | Độ đậm (Weight) | Khoảng cách dòng | Ứng dụng |
|---|---|---|---|---|
| **Display (Lớn)** | 28px - 32px | Bold (700) | 1.2 | Số thứ tự hàng chờ, Tiêu đề mở hộp quà |
| **Heading 1** | 22px | SemiBold (600) | 1.3 | Tiêu đề màn hình (Sổ Vịt, Đặt bàn) |
| **Heading 2** | 18px | SemiBold (600) | 1.35 | Tiêu đề thẻ con, Tên chi nhánh |
| **Body (Thường)** | 15px | Regular (400) | 1.5 | Nội dung mô tả, ghi chú đặt bàn |
| **Body Medium** | 15px | Medium (500) | 1.5 | Chữ trên nút bấm chính |
| **Caption (Nhỏ)** | 12px - 13px | Regular / Medium | 1.4 | Nhãn trạng thái, ngày giờ, số Ớt Vàng |

### C. Bo góc mềm mại (Border Radius)
* `radius-pill`: **`9999px`** — Nút bấm chính (CTA Button), thanh tìm kiếm, tab chips.
* `radius-card`: **`22px`** — Khung thẻ chính (Hero card hàng chờ, thẻ đặt bàn, thẻ voucher).
* `radius-mascot-card`: **`18px`** — Khung thẻ chứa từng chú Vịt Vàng.
* `radius-sm`: **`10px`** — Ô nhập liệu (Input field), badge nhỏ.

### D. Đổ bóng mộc mạc (Elevation & Shadows)
* `shadow-card`: `0 6px 20px rgba(74, 46, 27, 0.06)` — Bóng mờ tự nhiên màu nâu gỗ, tạo cảm giác thẻ nổi nhẹ trên bàn gỗ.
* `shadow-button-red`: `0 6px 18px rgba(197, 34, 31, 0.28)` — Ánh đỏ nâng nút bấm CTA.
* `shadow-button-gold`: `0 6px 18px rgba(229, 169, 60, 0.32)` — Ánh vàng kim cho nút mở hộp quà.

### E. Chuyển động mượt mà (Motion & Transitions)
* `transition-press`: `all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)` — Hiệu ứng nút lún nhẹ `scale(0.96)` khi ấn.
* `transition-tab`: `transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)` — Lướt mượt mà giữa các tab.
* `animation-wobble`: Lắc lư hộp quà bí ẩn khi chạm vào.

---

## 2. LAYOUT CHUNG (LAYOUT STRUCTURE)

Khung hiển thị được thiết kế tối ưu hóa chuẩn **Mobile Viewport**:
* **Kích thước tối ưu:** Chiều rộng `375px - 430px`, tỉ lệ 9:16 dọc màn hình. Khi mở trên máy tính, app tự động căn giữa như 1 chiếc điện thoại iPhone/Android sang trọng.
* **Cấu trúc 3 tầng chuẩn ngón tay cái (Thumb-zone):**

```
+-------------------------------------------------------+
|  [TẦNG 1: HEADER CỐ ĐỊNH - CAO 60px]                 |
|  (Logo Spicy Box)    [Chi nhánh: Vincom Thảo Điền v]  |
|  [Huy hiệu: 120 Ớt 🌶️]                                |
+-------------------------------------------------------+
|                                                       |
|  [TẦNG 2: VÙNG NỘI DUNG CUỘN (SCROLLABLE CONTENT)]    |
|                                                       |
|  - Thẻ thông tin hàng chờ Live                       |
|  - Khu vực tương tác chính (Đặt bàn / Blind Box)     |
|  - Bộ sưu tập Vịt Vàng                               |
|                                                       |
+-------------------------------------------------------+
|  [TẦNG 3: THANH ĐIỀU HƯỚNG ĐÁY (BOTTOM NAV) - CAO 72px]
|  [ 🏠 Home ]  [ ⏳ Chờ ]  [ 🎁 Hộp Quà ]  [ 🦆 Sổ Vịt ] [ 🎟️ Ví Ớt ] |
+-------------------------------------------------------+
```

---

## 3. WIREFRAME CHI TIẾT 5 MÀN HÌNH CHÍNH

### MÀN HÌNH 1: TRANG CHỦ & HÀNG CHỜ LIVE (HOME & LIVE QUEUE)

```
+-------------------------------------------------------+
|  SPICY BOX                [Vincom Thảo Điền v] (120🌶️)|
+-------------------------------------------------------+
|  [ BANNER MÙA: 🎃 LỄ HỘI HALLOWEEN TOKPOKKI ]         |
|  "Ăn lẩu thả ga - Săn Vịt Bí Ngô giới hạn!"          |
+-------------------------------------------------------+
|                                                       |
|  +-------------------------------------------------+  |
|  | THẺ HÀNG CHỜ TRỰC TIẾP (LIVE QUEUE)             |  |
|  |                                                 |  |
|  |    SỐ ĐANG PHỤC VỤ              SỐ CỦA BẠN      |  |
|  |       [  A-18  ]                 [  A-20  ]     |  |
|  |                                                 |  |
|  |   ⏳ Phía trước: Còn 2 bàn (Ước tính ~10 phút)   |  |
|  |   ● Trạng thái: Bạn có thể đi dạo thoải mái!    |  |
|  |                                                 |  |
|  |   [ (V) TÔI ĐÃ QUAY LẠI TRƯỚC CỬA QUÁN (Pill) ] |  |
|  +-------------------------------------------------+  |
|                                                       |
|  LỐI TẮT NHANH (QUICK ACTIONS):                       |
|  [ 📅 Đặt bàn tiệc ]    [ 🎁 Mở Blind Box Vịt ]      |
|  [ 📖 Menu Buffet ]    [ 🎟️ Đổi Voucher Ớt ]         |
|                                                       |
|  GỢI Ý MÓN HOT HÔM NAY:                              |
|  - Vòng Phô Mai Kéo Sợi (50 Ớt Vàng)                  |
|  - Ba chỉ bò Mỹ nhúng cay sốt Gochujang              |
+-------------------------------------------------------+
|  [ 🏠 Home ]  [ ⏳ Chờ ]  [ 🎁 Quà ]  [ 🦆 Sổ Vịt ]  [ 🎟️ Ví ]|
+-------------------------------------------------------+
```

---

### MÀN HÌNH 2: ĐẶT BÀN BUFFET TRƯỚC (SMART BOOKING)

```
+-------------------------------------------------------+
|  < Quay lại            ĐẶT BÀN BUFFET SPICY BOX       |
+-------------------------------------------------------+
|  1. CHỌN CHI NHÁNH:                                   |
|  [ Vincom Mega Mall Thảo Điền v ]                     |
|                                                       |
|  2. CHỌN NGÀY & KHUNG GIỜ (Cuộn ngang):               |
|  [ Hôm nay (24/10) ] [ Ngày mai (25/10) ] [ 26/10 ]   |
|  Ca trưa:  [ 11:30 ]  [(12:00)]  [ 12:30 ]  [ 13:00 ] |
|  Ca tối:   [ 17:30 ]  [ 18:00 ]  [(18:30)]  [ 19:30 ] |
|                                                       |
|  3. SỐ LƯỢNG KHÁCH:                                  |
|  - Người lớn:   [ - ]   04   [ + ]                    |
|  - Trẻ em:      [ - ]   01   [ + ]                    |
|                                                       |
|  4. KHU VỰC NGỒI YÊU THÍCH:                           |
|  (o) Gần quầy Line tự chọn    ( ) Bàn góc riêng tư   |
|                                                       |
|  5. CẤP ĐỘ SỐT LẨU YÊU THÍCH:                         |
|  [ 🌶️ Cay vừa ]   [ 🌶️🌶️ Cay chuẩn Hàn ]   [ 🌶️🌶️🌶️ Cực cay ]|
|                                                       |
|  +-------------------------------------------------+  |
|  |   [ XÁC NHẬN ĐẶT BÀN & NHẬN MÃ QR (Đỏ Pill) ]   |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  [ 🏠 Home ]  [ ⏳ Chờ ]  [ 🎁 Quà ]  [ 🦆 Sổ Vịt ]  [ 🎟️ Ví ]|
+-------------------------------------------------------+
```

---

### MÀN HÌNH 3: MỞ HỘP QUÀ BLIND BOX CHÚ VỊT (GACHA SYSTEM)

```
+-------------------------------------------------------+
|  SPICY BOX           BLIND BOX CHÚ VỊT VÀNG           |
+-------------------------------------------------------+
|  MÙA HIỆN TẠI: 🎃 BỘ SƯU TẬP HALLOWEEN SPICY BOX      |
|  "Cơ hội trúng Vịt Bí Ngô Cực Hiếm: 5%"               |
|                                                       |
|  Số lượt mở quà bạn đang có: [ 02 Lượt ] 🎁🎁         |
|                                                       |
|              +--------------------------+             |
|              |         (  🎀  )         |             |
|              |      /============\      |             |
|              |     |   SPICY BOX  |     |             |
|              |     |   BLIND BOX  |     |             |
|              |     |  [ HỘP ĐỎ ]  |     |             |
|              |      \============/      |             |
|              +--------------------------+             |
|                                                       |
|      👉 Chạm vào hộp quà để mở chú Vịt bí ẩn!        |
|                                                       |
|  +-------------------------------------------------+  |
|  |   [ 🎁 MỞ HỘP QUÀ NGAY (Vàng Hoàng Kim Pill) ]  |  |
|  +-------------------------------------------------+  |
|                                                       |
|  TỶ LỆ RƠI CÁC BIỂU CẢM VỊT:                         |
|  • Chào hỏi (30%)  • Vui vẻ (30%)  • Chu mỏ (15%)    |
|  • Giận dỗi (12%)  • Mếu máo (8%)  • Ngạc nhiên (5%)  |
+-------------------------------------------------------+
|  [ 🏠 Home ]  [ ⏳ Chờ ]  [ 🎁 Quà ]  [ 🦆 Sổ Vịt ]  [ 🎟️ Ví ]|
+-------------------------------------------------------+
```

---

### MÀN HÌNH 4: SỔ SƯU TẬP STICKER VỊT 4 MÙA (MASCOT ALBUM)

```
+-------------------------------------------------------+
|  SPICY BOX               SỔ SƯU TẬP VỊT VÀNG          |
+-------------------------------------------------------+
|  BỘ LỌC MÙA (Cuộn ngang chuyển đổi 4 Mùa):            |
|  [(🎃 Halloween)] [ ❄️ Giáng Sinh ] [ 🧧 Tết ] [ 🥮 Trung Thu ] |
|                                                       |
|  TIẾN ĐỘ THU THẬP: [ 4 / 6 BIỂU CẢM ]                 |
|  [████████████████████▒▒▒▒▒▒▒▒▒] 67%                  |
|  ★ Gom đủ 6/6: Tặng ngay 01 Vòng Phô Mai Kéo Sợi!    |
|                                                       |
|  LƯỚI 6 Ô BIỂU CẢM CHÚ VỊT (2 Cột x 3 Dòng):          |
|  +-----------------------+ +-----------------------+  |
|  |  [ Ảnh Vịt 3D ]       | |  [ Ảnh Vịt 3D ]       |  |
|  |  Chào hỏi             | |  Vui vẻ               |  |
|  |  Đã mở: x2            | |  Đã mở: x1            |  |
|  +-----------------------+ +-----------------------+  |
|  +-----------------------+ +-----------------------+  |
|  |  [ Ảnh Vịt 3D ]       | |  [ Ảnh Vịt 3D ]       |  |
|  |  Giận dỗi             | |  Chu mỏ               |  |
|  |  Đã mở: x1            | |  Đã mở: x1            |  |
|  +-----------------------+ +-----------------------+  |
|  +-----------------------+ +-----------------------+  |
|  |  [ BÓNG ĐEN ? ]       | |  [ BÓNG ĐEN ? ]       |  |
|  |  Mếu máo              | |  Ngạc nhiên (HIẾM)    |  |
|  |  Chưa mở khóa         | |  Chưa mở khóa         |  |
|  +-----------------------+ +-----------------------+  |
+-------------------------------------------------------+
|  [ 🏠 Home ]  [ ⏳ Chờ ]  [ 🎁 Quà ]  [ 🦆 Sổ Vịt ]  [ 🎟️ Ví ]|
+-------------------------------------------------------+
```

---

### MÀN HÌNH 5: VÍ ỚT VÀNG & ĐỔI VOUCHER (LOYALTY & REWARDS)

```
+-------------------------------------------------------+
|  SPICY BOX                 VÍ ƯU ĐÃI & VOUCHER        |
+-------------------------------------------------------+
|  +-------------------------------------------------+  |
|  |  THẺ THÀNH VIÊN SPICY BOX VIP                   |  |
|  |  Chủ thẻ: Nguyễn Văn A                          |  |
|  |  Số dư điểm: 120 Ớt Vàng 🌶️                    |  |
|  |  Hạng: THÀNH VIÊN VÀNG (GOLD MEMBER)            |  |
|  |  [ Mã vạch thành viên: |||| |||| |||| |||| ]   |  |
|  +-------------------------------------------------+  |
|                                                       |
|  TAB: [ (Đổi Voucher mới) ]    [ Voucher của tôi (2) ]|
|                                                       |
|  DANH SÁCH VOUCHER ĐỔI ĐƯỢC:                         |
|  +-------------------------------------------------+  |
|  | [ 🧀 ] VÒNG PHÔ MAI BẮP KÉO SỢI                 |  |
|  | Cần: 50 Ớt 🌶️                [ ĐỔI NGAY (Pill) ]|  |
|  +-------------------------------------------------+  |
|  | [ 🥩 ] ĐĨA BA CHỈ BÒ MỸ THƯỢNG HẠNG             |  |
|  | Cần: 35 Ớt 🌶️                [ ĐỔI NGAY (Pill) ]|  |
|  +-------------------------------------------------+  |
|  | [ 🎟️ ] VOUCHER GIẢM 50.000Đ CHO VÉ BUFFET       |  |
|  | Cần: 70 Ớt 🌶️                [ ĐỔI NGAY (Pill) ]|  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  [ 🏠 Home ]  [ ⏳ Chờ ]  [ 🎁 Quà ]  [ 🦆 Sổ Vịt ]  [ 🎟️ Ví ]|
+-------------------------------------------------------+
```
