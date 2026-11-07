# Realtime Booking Slots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây khung giờ đặt bàn realtime theo thiết kế đã duyệt với ba trạng thái và giữ slot an toàn.

**Architecture:** Hàm thuần xác định trạng thái được kiểm tra bằng Node test. Supabase RPC sở hữu việc claim/release/confirm nguyên tử; hook React tải và subscribe dữ liệu; component hiển thị chỉ nhận view-model và callback.

**Tech Stack:** React 19, TypeScript 6, Supabase JS, PostgreSQL, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-07-realtime-booking-slots-design.md`

## Global Constraints

- Không thêm dependency.
- Giữ nguyên luồng đặt bàn/thanh toán hiện có ngoài vùng chọn loại bàn, số khách và giờ.
- Màu không được là tín hiệu duy nhất; mọi trạng thái phải có nhãn.
- Migration chưa áp dụng phải hiện lỗi và khóa slot, không dùng dữ liệu giả.

## Review Focus

- Cạnh tranh slot cuối: chỉ một claim được tạo.
- Lượt giữ hết hạn hoặc được release không tiếp tục chiếm chỗ.
- Người đang giữ slot vẫn có thể tiếp tục dù trạng thái tổng là `Đang xử lý`.
- Đổi ngày/chi nhánh/loại bàn không để lại claim cũ.
- Xác nhận thanh toán thất bại không được hiện đặt bàn thành công.

---

### Task 1: Quy tắc trạng thái slot

**Files:**
- Create: `spicy-box-app/src/bookingSlots.ts`
- Create: `spicy-box-app/tests/bookingSlots.test.ts`
- Modify: `spicy-box-app/package.json`

**Interfaces:**
- Produces: `getBookingSlotState(metric, tableType)`, `getRemainingTables(metric, tableType)`, `BOOKING_SLOT_CAPACITY`.

- [ ] Viết test thất bại cho còn trống, đang xử lý, hết chỗ và biên sức chứa sinh nhật.
- [ ] Chạy `npm test` và xác nhận lỗi vì module chưa tồn tại.
- [ ] Cài đặt tối thiểu các type/hàm thuần.
- [ ] Chạy `npm test` và xác nhận tất cả pass.

### Task 2: Backend và client realtime

**Files:**
- Create: `supabase/migrations/20261107000000_booking_slots.sql`
- Create: `spicy-box-app/src/bookingSlotApi.ts`
- Create: `spicy-box-app/src/hooks/useBookingSlots.ts`

**Interfaces:**
- Consumes: type/constant từ Task 1.
- Produces: RPC `get_booking_slot_metrics`, `claim_booking_slot`, `release_booking_slot`, `confirm_booking_slot`; hook trả metrics, selection và trạng thái tải/lỗi.

- [ ] Thêm schema claim, RLS/read policy, publication và RPC có advisory lock.
- [ ] Thêm client Supabase mỏng cho bốn RPC và subscription.
- [ ] Thêm hook quản lý lifecycle claim, refetch realtime và lỗi.
- [ ] Chạy `npm test` và `npm run build`.

### Task 3: Giao diện và tích hợp luồng thanh toán

**Files:**
- Create: `spicy-box-app/src/components/booking/BookingSlotPicker.tsx`
- Modify: `spicy-box-app/src/components/tabs/BookingTab.tsx`
- Modify: `spicy-box-app/src/index.css`

**Interfaces:**
- Consumes: hook Task 2 và hàm trạng thái Task 1.
- Produces: UI chọn bàn/số khách/slot; xác nhận claim trước màn hình thành công.

- [ ] Dựng UI theo ảnh với hai loại bàn, hai dải số khách, legend và slot card responsive.
- [ ] Thay lưới giờ cũ, nối lựa chọn với giá vé hiện tại.
- [ ] Xác nhận claim trước khi gọi `onBookingComplete`; lỗi phải giữ người dùng ở bước thanh toán.
- [ ] Chạy detector, `npm test`, `npm run lint` và `npm run build`.
