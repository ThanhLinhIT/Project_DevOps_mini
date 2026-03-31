
---

# 📄 PRD — Product Requirements Document

## Pickleball Court Booking System — Core Booking Module

---

## Trường | Nội dung

**Sản phẩm** | Pickleball Court Booking System — Module Đặt Sân
**Phiên bản** | 1.0
**Trạng thái** | Draft
**Ngày** | 2026-03-24
**Tác giả** | Engineering Team

---

# 1. Tổng quan sản phẩm (Overview)

## 1.1 Vấn đề cần giải quyết

Hiện tại, việc đặt sân Pickleball tại các sân thể thao vẫn mang tính thủ công:

* Người chơi liên hệ qua điện thoại/Zalo
* Chủ sân ghi chép lịch bằng sổ hoặc Excel
* Dễ xảy ra:

  * Trùng lịch (double booking)
  * Sai sót thông tin
  * Không kiểm soát được lịch sử đặt sân

👉 Dữ liệu phân tán, không realtime, khó quản lý khi scale nhiều sân

---

## 1.2 Giải pháp

Xây dựng một web application cho phép:

* Người chơi:

  * Xem lịch trống theo thời gian thực
  * Đặt sân online 24/7

* Chủ sân:

  * Quản lý lịch đặt tập trung
  * Theo dõi trạng thái booking

* Hệ thống:

  * Lưu trữ dữ liệu có cấu trúc
  * Tránh trùng lịch bằng cơ chế lock slot

---

## 1.3 Phạm vi phiên bản 1.0

Phiên bản này tập trung vào:

* Booking cơ bản (core flow)
* Quản lý lịch sân
* Lưu trữ dữ liệu booking

❌ Chưa bao gồm:

* Thanh toán online
* Notification (email/push)
* Dashboard analytics

---

# 2. Người dùng mục tiêu (Target Users)

## 2.1 Người chơi (Players)

**Đặc điểm:**

* 18–40 tuổi
* Sử dụng smartphone thường xuyên

**Mục tiêu:**

* Đặt sân nhanh, dễ dùng

**Pain points:**

* Không biết sân còn trống hay không
* Phải gọi điện mất thời gian

---

## 2.2 Chủ sân (Court Owners / Admin)

**Đặc điểm:**

* Quản lý 1 hoặc nhiều sân

**Mục tiêu:**

* Xem lịch đặt sân realtime
* Tránh trùng lịch

**Pain points:**

* Quản lý thủ công → dễ sai sót
* Không có hệ thống tập trung

---

# 3. Mục tiêu sản phẩm (Product Goals)

| Mục tiêu                  | Chỉ số đo lường (Metric) | Kỳ vọng |
| ------------------------- | ------------------------ | ------- |
| Người dùng đặt sân online | Tỷ lệ booking thành công | > 85%   |
| Tránh trùng lịch          | Tỷ lệ double booking     | = 0     |
| Tốc độ hệ thống           | API response             | < 1s    |
| Độ ổn định                | Tỷ lệ lưu thành công     | 99.9%   |

---

# 4. Tính năng sản phẩm (Features)

---

## F-01: Xem danh sách sân & lịch trống

**Mô tả:**
Hiển thị danh sách sân và các khung giờ còn trống theo ngày.

**Thông tin hiển thị:**

* Tên sân
* Địa điểm
* Danh sách slot (available / booked)

**Hành vi:**

* Load khi mở trang
* Cập nhật realtime sau khi có booking

---

## F-02: Đặt sân (Booking)

**Mô tả:**
Người dùng chọn sân và khung giờ để đặt.

**Đầu vào bắt buộc:**

* Tên người đặt
* Số điện thoại / email
* Sân
* Thời gian (start – end)

---

**Hành vi khi gửi:**

* Hiển thị loading
* Thành công:

  * Thông báo "✅ Đặt sân thành công"
* Thất bại:

  * Hiển thị lỗi cụ thể

---

## F-03: Quản lý danh sách booking

**Mô tả:**
Hiển thị toàn bộ booking đã tạo.

**Thông tin hiển thị:**

* Tên người đặt
* Sân
* Thời gian
* Trạng thái (Pending / Confirmed)
* Thời điểm tạo

---

**Hành vi:**

* Sắp xếp mới nhất trước
* Tự động cập nhật khi có booking mới

---

## F-04: Validate dữ liệu

**Mô tả:**
Kiểm tra dữ liệu trước khi lưu database.

| Trường   | Validation       |
| -------- | ---------------- |
| name     | Bắt buộc         |
| email    | Đúng định dạng   |
| timeslot | Không được trùng |
| court_id | Phải tồn tại     |

---

**Response lỗi:**

* HTTP 400
* Message rõ ràng

---

## F-05: API Health Check

**Mô tả:**
Kiểm tra trạng thái hệ thống.

* GET /api/health
  → HTTP 200
  → `{ status: "ok" }`

---

# 5. Luồng người dùng (User Flows)

---

## Flow 1: Đặt sân thành công

Mở website
→ Chọn sân
→ Chọn khung giờ
→ Nhập thông tin
→ Nhấn "Đặt sân"
→ Loading
→ "✅ Thành công"
→ Slot chuyển sang trạng thái "Booked"

---

## Flow 2: Trùng lịch

Mở website
→ Chọn slot đã có người đặt
→ Nhấn "Đặt"
→ ❌ "Khung giờ đã được đặt"

---

## Flow 3: Admin xem booking

Mở dashboard
→ Danh sách booking hiển thị
→ Xem thông tin chi tiết

---

# 6. Yêu cầu phi chức năng (Non-Functional Requirements)

| Loại        | Yêu cầu                               |
| ----------- | ------------------------------------- |
| Hiệu năng   | API response < 1s                     |
| Bảo mật     | Validate input, chống SQL injection   |
| Đồng bộ     | Tránh race condition (lock slot)      |
| Khả dụng    | Healthcheck OK trước khi nhận request |
| Môi trường  | Docker-ready                          |
| Trình duyệt | Chrome, Edge, Firefox latest          |

---

# 7. Giới hạn phiên bản 1.0 (Out of Scope)

* Đăng nhập / phân quyền
* Thanh toán online
* Hủy / sửa booking
* Notification
* Rating & review
* Dashboard analytics
* Mobile app

---

# 8. Phụ thuộc kỹ thuật (Technical Dependencies)

| Component  | Technology         | Version |
| ---------- | ------------------ | ------- |
| Backend    | Node.js            | 18.x    |
| Framework  | Express / NestJS   | Latest  |
| Database   | PostgreSQL / MySQL | 8.x     |
| Frontend   | React              | 18.x    |
| Build Tool | Vite               | 4.x     |
| Container  | Docker             | 24.x    |

---

# 9. Điều kiện hoàn thành (Definition of Done)

Một tính năng được coi là hoàn thành khi:

* API hoạt động đúng (success + error cases)
* Không xảy ra double booking
* Validation đầy đủ backend
* Frontend hiển thị đúng:

  * Loading
  * Success
  * Error
* Chạy được:

  * Local
  * Docker
* Không hardcode:

  * Secret key
  * DB credentials

---

# ✅ Kết luận

Phiên bản 1.0 tập trung vào:
👉 **Giải quyết triệt để bài toán core: đặt sân & tránh trùng lịch**

