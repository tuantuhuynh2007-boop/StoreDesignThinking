# Thiết kế khung giờ đặt bàn realtime

## Mục tiêu

Thay vùng chọn giờ đơn giản trong `BookingTab` bằng giao diện theo ba ảnh đã duyệt: chọn loại bàn, chọn số khách, xem số bàn/số người đã đặt và nhận biết ba trạng thái bằng cả màu lẫn nhãn.

## Hành vi

- Bàn tiêu chuẩn nhận 1–4 khách và có tối đa 5 bàn cho mỗi chi nhánh/ngày/khung giờ.
- Bàn sinh nhật nhận 8–12 khách và có tối đa 1 bàn cho mỗi chi nhánh/ngày/khung giờ.
- `Còn trống` (xanh): còn ít nhất một bàn chưa được đặt hoặc giữ; người dùng có thể chọn.
- `Đang xử lý` (cam): số bàn đã đặt cộng số lượt giữ chỗ đang hoạt động đã chạm sức chứa; người khác không thể chọn. Người đang giữ vẫn thấy slot của mình.
- `Hết chỗ` (đỏ): số bàn đã đặt đã chạm sức chứa; không thể chọn.
- Chọn slot tạo lượt giữ chỗ 10 phút bằng RPC nguyên tử. Đổi slot, đổi ngày/chi nhánh/loại bàn hoặc rời màn hình sẽ giải phóng lượt giữ; thanh toán thành công chuyển lượt giữ thành đã đặt.
- Hủy lượt đặt ở dữ liệu sẽ làm số bàn và trạng thái trở lại `Còn trống` qua Supabase Realtime.

## Phạm vi và ranh giới

- Giữ nguyên luồng chi nhánh, ngày, vị cay, thanh toán và màn hình thành công hiện có.
- Dùng Supabase hiện có, không thêm dependency.
- Không xây màn hình quản trị/hủy bàn; backend hỗ trợ trạng thái `CANCELLED` để POS hoặc thao tác dữ liệu trả chỗ.
- Không giả lập realtime nếu migration chưa được áp dụng; UI hiển thị lỗi tải sức chứa và khóa chọn giờ.

## Phương án

- Chỉ mô phỏng ở frontend: nhanh nhưng không chống tranh chấp và không phải realtime thực — loại.
- Ghi trực tiếp từ client: ít SQL nhưng hai người có thể lấy slot cuối cùng — loại.
- RPC PostgreSQL nguyên tử + bảng claim + Supabase Realtime: được chọn vì đáp ứng đúng cạnh tranh, thoát, hoàn tất và hủy chỗ.
