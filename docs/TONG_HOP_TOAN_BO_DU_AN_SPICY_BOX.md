# TỔNG HỢP TOÀN BỘ ĐẶC TẢ DỰ ÁN: SPICY BOX SMART WEB APP
> **Hệ Thống Đặt Bàn, Hàng Chờ Thời Gian Thực & Bộ Sưu Tập Linh Vật Số Blind Box Theo Mùa**  
> **Thương hiệu áp dụng:** Chuỗi nhà hàng Buffet Lẩu Tokpokki **Spicy Box** (Việt Nam)  
> **Phương pháp phát triển:** Design Thinking (Lấy trải nghiệm khách hàng làm trung tâm)  
> **Nền tảng kỹ thuật:** Mobile-First Web App / Progressive Web App (PWA)

---

## MỤC LỤC TỔNG QUAN

1. [Bối Cảnh & Mục Tiêu Dự Án](#1-bối-cảnh--mục-tiêu-dự-án)
2. [Phân Tích Nỗi Đau Thực Khách & Cơ Chế Giải Quyết](#2-phân-tích-nỗi-đau-thực-khách--cơ-chế-giải-quyết)
3. [Triết Lý Thiết Kế & Hệ Thống Design Tokens](#3-triết-lý-thiết-kế--hệ-thống-design-tokens)
4. [Hệ Sinh Thái Tính Năng Chi Tiết](#4-hệ-sinh-thái-tính-năng-chi-tiết)
   - [4.1 Phân hệ Khách hàng (Mobile Web)](#41-phân-hệ-khách-hàng-mobile-web-app)
   - [4.2 Phân hệ Quản lý & Nhân viên (Staff POS Dashboard)](#42-phân-hệ-quản-lý--nhân-viên-staff-pos-dashboard)
5. [Hệ Thống 24 Chú Vịt Vàng Linh Vật 4 Mùa (Mascot Gacha)](#5-hệ-thống-24-chú-vịt-vàng-linh-vật-4-mùa)
6. [Kiến Trúc Kỹ Thuật & Ngăn Xếp Công Nghệ (Tech Stack)](#6-kiến-trúc-kỹ-thuật--ngăn-xếp-công-nghệ)
7. [Luồng Xác Thực Người Dùng (Authentication Flow)](#7-luồng-xác-thực-người-dùng-auth-flow)
8. [Quy Tắc Nghiệp Vụ Biên & Chống Gian Lận (Business Rules)](#8-quy-tắc-nghiệp-vụ-biên--chống-gian-lận)
9. [Sơ Đồ Cơ Sở Dữ Liệu Chi Tiết (Database Schema)](#9-sơ-đồ-cơ-sở-dữ-liệu-chi-tiết)
10. [Lộ Trình Triển Khai Thực Tế (Implementation Roadmap)](#10-lộ-trình-triển-khai-thực-tế)

---

## 1. BỐI CẢNH & MỤC TIÊU DỰ ÁN

### 1.1 Thương hiệu Spicy Box
Spicy Box là chuỗi nhà hàng buffet lẩu Tokpokki Hàn Quốc được yêu thích hàng đầu tại các Trung tâm Thương mại lớn ở Việt Nam (Vincom, Gigamall, Emart, Estella...). Tệp khách hàng chủ đạo là giới trẻ (Gen Z, Gen Y), học sinh, sinh viên, gia đình trẻ yêu thích ẩm thực cay nồng, phô mai và không gian ấm cúng.

### 1.2 Mục tiêu của Web App
1. **Chuyển đổi số trải nghiệm khách hàng tại chỗ (In-store CX):** Thay thế việc xếp hàng bấm số giấy thủ công bằng giải pháp số di động.
2. **Loại bỏ 100% cảm giác chờ đợi mệt mỏi:** Biến thời gian chờ đợi thành thời gian tự do mua sắm giải trí trong trung tâm thương mại.
3. **Gia tăng tỷ lệ khách quay lại (Retention Rate):** Thông qua cơ chế game hóa (Gamification) mở hộp mù (Blind Box) chú Vịt Vàng và tích lũy "Ớt Vàng" đổi voucher.

---

## 2. PHÂN TÍCH NỖI ĐAU THỰC KHÁCH & CƠ CHẾ GIẢI QUYẾT

| Nỗi đau của khách hàng (Pain Points) | Hậu quả đối với quán | Cơ chế giải quyết của Web App |
|---|---|---|
| **Đứng đợi mỏi chân trước cửa:** Giờ cao điểm cuối tuần phải chen chúc 30-45 phút trước quầy. | Khách bỏ đi sang quán khác ăn vì nản lòng; sảnh cửa quán hỗn loạn. | **Hàng chờ thời gian thực (Live Queue):** Quét QR lấy số điện tử, đi dạo TTTM thoải mái. Điện thoại rung và báo chuông khi còn 2 lượt. |
| **Sợ hết bàn vào khung giờ vàng:** Đi nhóm đông người đến quán mới biết đã kín bàn. | Bị động trong phục vụ, bỏ lỡ doanh thu từ khách đi theo nhóm tiệc. | **Đặt bàn trước thông minh:** Đặt ca trưa/tối, chọn số lượng vé buffet, ghi chú vị sốt lẩu và nhận mã QR giữ bàn. |
| **Tích điểm truyền thống nhàm chán:** Đọc số điện thoại tích điểm không mang lại cảm xúc. | Khách không quan tâm đến chương trình thành viên, tỷ lệ quay lại thấp. | **Hộp quà Blind Box Chú Vịt Vàng:** Mỗi lần ăn lẩu được mở 1 hộp quà 3D nhận 1 chú Vịt theo mùa. Sưu tập đủ bộ nhận quà lớn. |

---

## 3. TRIẾT LÝ THIẾT KẾ & HỆ THỐNG DESIGN TOKENS

### 3.1 Định hướng thẩm mỹ (Aesthetic)
* **Phong cách:** Tối giản (Minimalism) kết hợp Mộc mạc ấm cúng (Japandi / Modern Korean Dining).
* **Đường nét:** Mềm mại, thân thiện, 100% nút bấm và khung thẻ đều bo tròn (Pill-shaped buttons và Card rounded 22px).

### 3.2 Bảng màu chuẩn (Color Palette)
* **Nền tảng:**
  * Trắng kem (`#FDFBF7`) & Trắng sứ (`#FFFFFF`): Không gian thoáng đãng, sạch sẽ, không gây chói mắt.
  * Nâu gỗ sồi trầm ấm (`#4A2E1B` & `#7A5339`): Tạo cảm giác mộc mạc như bàn gỗ nhà hàng lẩu.
* **Màu điểm nhấn (Accents):**
  * Đỏ Spicy Box (`#C5221F`): Màu sắc của sốt lẩu Tokpokki cay nồng Gochujang, dùng cho các nút kêu gọi hành động (CTA).
  * Vàng Hoàng Kim (`#E5A93C`): Màu của viền phô mai bắp béo ngậy, ngôi sao điểm thưởng và ánh hào quang mở quà.

### 3.3 Hiệu ứng chuyển động (Motion & Micro-interactions)
* Chạm nút lún nhẹ `scale(0.96)` với gia tốc lò xo đàn hồi (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
* Hộp quà lắc lư (wobble) khi chạm vào, bung nắp kèm pháo giấy vàng kim khi mở khóa chú Vịt Vàng.

---

## 4. HỆ SINH THÁI TÍNH NĂNG CHI TIẾT

### 4.1 Phân hệ Khách hàng (Mobile Web App)

1. **Trang chủ & Hàng chờ thời gian thực (Live Queue Tracking):**
   * Hiển thị số đang phục vụ tại quán và số thứ tự của khách (`A-18` vs `A-20`).
   * Đếm ngược số lượt còn lại (*"Còn 2 bàn nữa, ước tính ~10 phút"*).
   * Nút xác nhận: *"Tôi đã quay lại trước cửa quán"*.
   * Rung điện thoại liên tục + đổi màu màn hình khi đến lượt vào bàn.
2. **Đặt bàn tiệc trước (Smart Reservation):**
   * Chọn chi nhánh (Vincom Thảo Điền, Gigamall...).
   * Chọn ngày dùng bữa và khung giờ (Ca trưa: 11:30 - 13:00 / Ca tối: 17:30 - 19:30).
   * Chọn số lượng vé buffet (Người lớn, trẻ em).
   * Chọn vị sốt lẩu ưu tiên (Cay vừa, Cay chuẩn Hàn, Cực cay).
   * Nhận mã vé QR lưu trực tiếp vào ví.
3. **Mở hộp quà Blind Box Chú Vịt Vàng (Gacha System):**
   * Hộp quà màu đỏ thắt nơ vàng kim Spicy Box.
   * Chạm ngón tay để xé nắp hộp quà 3D, mở ra ngẫu nhiên 1 trong 6 chú Vịt theo mùa.
   * Tự động lưu chú vịt vào sổ sưu tập.
4. **Sổ Sưu Tập Vịt Vàng 4 Mùa (Mascot Album):**
   * Thanh chuyển đổi 4 Mùa: *[ 🎃 Halloween ] [ ❄️ Giáng Sinh ] [ 🧧 Tết ] [ 🥮 Trung Thu ]*.
   * Lưới 6 ô biểu cảm 3D: Vịt đã mở sáng rõ màu; vịt chưa mở hiện bóng đen bí ẩn `?`.
   * Thanh tiến độ: *"Gom đủ 6/6 biểu cảm nhận ngay 01 Vòng Phô Mai Bắp"*.
5. **Ví Ớt Vàng 🌶️ & Đổi Voucher (Loyalty & Rewards):**
   * Thẻ VIP thành viên hiển thị số dư điểm "Ớt Vàng".
   * Đổi điểm lấy các món hot: Vòng phô mai bắp (50 Ớt), Đĩa ba chỉ bò Mỹ (35 Ớt), Voucher giảm 50.000đ vé buffet (70 Ớt).
   * Sinh mã QR dùng 1 lần để đưa thu ngân quét áp dụng giảm giá.

---

### 4.2 Phân hệ Quản lý & Nhân viên (Staff POS Dashboard)

1. **Bộ chuyển đổi Mùa 1-Chạm (Season Switcher):**
   * Quản lý chọn mùa trên menu thả xuống ➔ Toàn bộ điện thoại khách hàng lập tức đổi theme và đổi kho quà Vịt tương ứng.
2. **Trạm gọi số hàng chờ (Queue Calling Station):**
   * Nút bấm to màu đỏ: **[ 🔔 GỌI SỐ TIẾP THEO ]**.
   * Nút nhắc lại lần 2 (gửi thêm rung chuông đến khách).
   * Nút đánh dấu: **[ ❌ Khách vắng mặt / Bỏ lượt ]**.
   * Nút gạt: **[ ⏸️ Tạm dừng nhận hàng chờ ]** khi quán quá tải giờ cao điểm.
3. **Bảng điều phối danh sách hàng chờ:**
   * Xem danh sách khách đang chờ, lọc theo cỡ bàn (Bàn 1-2 người, 3-4 người, bàn lớn 5+).
   * Nút một chạm: **[ ✓ Đã vào bàn ]** khi dẫn khách vào chỗ ngồi.
4. **Công cụ thu ngân POS nhanh:**
   * **Cấp lượt mở hộp quà:** Nhập số bàn/hóa đơn thanh toán ➔ Tự động cấp 1 token mở quà cho khách.
   * **Quét mã Voucher:** Dùng camera quét mã QR của khách để trừ tiền hóa đơn trong 1 giây.

---

## 5. HỆ THỐNG 24 CHÚ VỊT VÀNG LINH VẬT 4 MÙA

Ma trận 24 chú Vịt Vàng độc quyền được chia đều theo **4 Mùa x 6 Biểu Cảm** (Toàn bộ 24 file ảnh PNG chất lượng cao đã được cắt rời và lưu trữ tại `assets/ducks/`):

| Mùa (Season) | Biểu Cảm | File Ảnh Vật Lý | Độ Hiếm | Tỷ Lệ Rơi |
|---|---|---|:---:|:---:|
| **🎃 MÙA HALLOWEEN** (Đội mũ bí ngô) | Giận dỗi | `halloween_gian_doi.png` | Common | 15% |
| | Chào hỏi (Hello!) | `halloween_chao_hoi.png` | Common | 30% |
| | Mếu máo | `halloween_meu_mao.png` | Common | 15% |
| | Chu mỏ (Nháy mắt) | `halloween_chu_mo.png` | Rare | 15% |
| | Ngạc nhiên | `halloween_ngac_nhien.png` | Legendary | 5% |
| | Vui vẻ (Cười tươi) | `halloween_vui_ve.png` | Common | 20% |
| **❄️ MÙA GIÁNG SINH** (Khăn len & cây thông tuyết) | Giận dỗi | `christmas_gian_doi.png` | Common | 15% |
| | Chào hỏi | `christmas_chao_hoi.png` | Common | 30% |
| | Mếu máo | `christmas_meu_mao.png` | Common | 15% |
| | Chu mỏ | `christmas_chu_mo.png` | Rare | 15% |
| | Ngạc nhiên | `christmas_ngac_nhien.png` | Legendary | 5% |
| | Vui vẻ | `christmas_vui_ve.png` | Common | 20% |
| **🥮 MÙA TRUNG THU** (Đèn lồng & áo gấm trăng rằm) | Giận dỗi | `midautumn_gian_doi.png` | Common | 15% |
| | Chào hỏi | `midautumn_chao_hoi.png` | Common | 30% |
| | Mếu máo | `midautumn_meu_mao.png` | Common | 15% |
| | Chu mỏ | `midautumn_chu_mo.png` | Rare | 15% |
| | Ngạc nhiên | `midautumn_ngac_nhien.png` | Legendary | 5% |
| | Vui vẻ | `midautumn_vui_ve.png` | Common | 20% |
| **🧧 MÙA TẾT NGUYÊN ĐÁN** (Áo dài đỏ & bánh chưng) | Giận dỗi | `tet_gian_doi.png` | Common | 15% |
| | Chào hỏi | `tet_chao_hoi.png` | Common | 30% |
| | Mếu máo | `tet_meu_mao.png` | Common | 15% |
| | Chu mỏ | `tet_chu_mo.png` | Rare | 15% |
| | Ngạc nhiên | `tet_ngac_nhien.png` | Legendary | 5% |
| | Vui vẻ | `tet_vui_ve.png` | Common | 20% |

---

## 6. KIẾN TRÚC KỸ THUẬT & NGĂN XẾP CÔNG NGHỆ

* **Frontend (Khách hàng & POS):**
  * Framework: **Next.js 14 / React (App Router)**.
  * Styling: **Tailwind CSS** + CSS Variables Design Tokens.
  * Animation: **Framer Motion** (Đạt chuẩn 60fps mượt mà trên di động).
  * Tiêu chuẩn: **Progressive Web App (PWA)** với Web Vibration API (rung máy) và Web Push Notifications.
* **Backend & Xử lý thời gian thực:**
  * Nền tảng: **Node.js (TypeScript)** + Fastify / Express.
  * Realtime Engine: **WebSocket (Socket.io)** hoặc **Supabase Realtime** (Độ trễ < 100ms khi gọi số).
* **Cơ sở dữ liệu (Database):**
  * Hệ quản trị: **PostgreSQL** (chạy trên Supabase / Neon DB). Đảm bảo giao dịch ACID an toàn khi đổi voucher.
* **Hạ tầng triển khai (Hosting):**
  * Frontend: Vercel / Cloudflare Pages.
  * Backend & DB: Render / Railway / Supabase.

---

## 7. LUỒNG XÁC THỰC NGƯỜI DÙNG (AUTH FLOW)

1. **Tiếp cận không rào cản (Zero-Barrier Onboarding):**
   * Khách quét mã QR: Web app tự động cấp một mã định danh tạm thời `guest_uuid` lưu trong LocalStorage của máy khách.
   * Khách được lấy số hàng chờ, xem thực đơn, xem sổ vịt ngay mà **không cần đăng nhập mật khẩu**.
2. **Định danh nâng cao (Progressive Profiling):**
   * Khi khách thực hiện hành động cần lưu trữ vĩnh viễn (Đặt bàn tiệc, Đổi voucher, Lưu điểm Ớt Vàng): Web mới hiện hộp thoại nhập Số Điện Thoại + OTP qua Zalo/SMS.
3. **Phân quyền Nhân viên (Staff / Manager):**
   * Nhân viên đăng nhập vào Bảng POS bằng mã PIN 4 số hoặc tài khoản nội bộ riêng (`Role: STAFF / MANAGER`).

---

## 8. QUY TẮC NGHIỆP VỤ BIÊN & CHỐNG GIAN LẬN

* **Chống lấy số ảo từ xa:** Khách bắt buộc phải quét mã QR động (Dynamic QR đổi mã mỗi 5 phút) đặt tại cửa quán, hoặc web kiểm tra định vị GPS trong bán kính 100m quanh nhà hàng.
* **Xử lý trôi số hàng chờ:** Nếu gọi 3 lần khách không có mặt, hệ thống chuyển sang trạng thái `MISSED` (Quá lượt). Chỗ được giữ ưu tiên trong 10 phút trước khi nhường cho lượt tiếp theo.
* **Chống gian lận mở hộp quà:** Token mở hộp quà được ký số từ máy thu ngân sau khi thanh toán hóa đơn bàn ăn, ngăn chặn việc người dùng tự can thiệp API để mở quà vô hạn.
* **Cơ chế tái chế Sticker trùng:** Khách mở trúng 3 chú vịt trùng nhau có thể bấm đổi lấy 1 lượt mở hộp mới hoặc đổi ra 15 Ớt Vàng.

---

## 9. SƠ ĐỒ CƠ SỞ DỮ LIỆU CHI TIẾT

Hệ thống được chuẩn hóa qua 9 bảng dữ liệu SQL (Xem toàn bộ mã lệnh DDL trong file `schema.sql`):

1. `stores`: Lưu danh sách các chi nhánh Spicy Box, mùa hiện tại, trạng thái mở/đóng hàng chờ.
2. `users`: Lưu thông tin khách hàng, số điện thoại, guest_uuid, số dư Ớt Vàng, hạng VIP.
3. `queues`: Quản lý danh sách hàng chờ, số thứ tự (A-18), quy mô bàn, trạng thái (WAITING, CALLED, SEATED, MISSED).
4. `reservations`: Quản lý lịch đặt bàn trước, ngày giờ, số lượng vé buffet, vị sốt lẩu.
5. `mascots`: Danh mục 24 chú Vịt Vàng theo 4 mùa, tên biểu cảm, URL ảnh, độ hiếm, tỷ lệ rơi %.
6. `user_mascots`: Sổ sưu tập cá nhân, lưu ai đang sở hữu chú vịt nào và số lượng trùng.
7. `vouchers`: Danh mục các voucher ưu đãi và số Ớt Vàng cần để đổi.
8. `user_vouchers`: Ví voucher cá nhân chứa mã QR dùng 1 lần, trạng thái đã sử dụng, hạn dùng.
9. `gacha_tokens`: Quản lý các token mở hộp quà hợp lệ sinh ra từ hóa đơn bàn ăn.

---

## 10. LỘ TRÌNH TRIỂN KHAI THỰC TẾ

```
[ Giai đoạn 1: Chuẩn bị & Thiết kế ] --> [ Giai đoạn 2: Lập trình Frontend & Backend ] --> [ Giai đoạn 3: Triển khai thực tế tại quán ]
- Đã hoàn tất Design Tokens               - Khởi tạo dự án Next.js & Tailwind             - In mã QR vật lý đặt tại các bàn & cửa
- Đã hoàn tất Wireframes & Prototype      - Kết nối Database PostgreSQL (Supabase)         - Đào tạo nhân viên sử dụng POS Dashboard
- Đã cắt đủ 24 ảnh chú Vịt Vàng           - Xây dựng WebSocket hàng chờ thời gian thực    - Chạy thử nghiệm 1 tuần tại Vincom Thảo Điền
- Đã hoàn thiện Database Schema (SQL)     - Tích hợp hiệu ứng xé hộp quà Blind Box
```

---

*Tài liệu này được biên soạn và đồng bộ trực tiếp trong mã nguồn dự án tại GitHub Repository: [StoreDesignThinking](https://github.com/tuantuhuynh2007-boop/StoreDesignThinking.git).*
