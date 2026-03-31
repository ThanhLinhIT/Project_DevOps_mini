
---

# 📘 Use Cases — Pickleball Court Booking System

**Tài liệu:** Use Case Specification
**Phiên bản:** 2.0
**Chuẩn:** UML Use Case / IEEE 830
**Ngày:** 2026-03-24

---

# 🧭 Sơ đồ Use Case tổng quan

```
┌──────────────────────────────────────────────┐
│ Pickleball Court Booking System              │
│                                              │
│  ┌──────────┐                                │
│  │ Player   │──────► UC-01: Đặt sân          │
│  └──────────┘                                │
│        │                                     │
│        ├──────► UC-02: Xem danh sách booking │◄────── Admin
│        │                                     │
│  ┌──────────┐                                │
│  │ Admin    │──────► UC-03: Kiểm tra hệ thống│
│  └──────────┘                                │
│                                              │
│  ┌──────────┐                                │
│  │ System   │──────► UC-04: Init database    │
│  └──────────┘                                │
│                                              │
└──────────────────────────────────────────────┘
```

---

# 👥 Danh sách Actors

| Actor    | Loại      | Mô tả               |
| -------- | --------- | ------------------- |
| Player   | Primary   | Người chơi đặt sân  |
| Admin    | Primary   | Quản lý hệ thống    |
| System   | Secondary | Backend service     |
| Database | Secondary | Hệ quản trị dữ liệu |

---

# 📌 UC-01: Đặt sân Pickleball

| Trường               | Nội dung                     |
| -------------------- | ---------------------------- |
| Use Case ID          | UC-01                        |
| Tên                  | Đặt sân                      |
| Actor chính          | Player                       |
| Mức độ               | User Goal                    |
| Ưu tiên              | Must Have                    |
| Điều kiện tiên quyết | Server đang chạy; DB healthy |

---

## 🧾 Mô tả ngắn

Người chơi chọn sân, ngày và khung giờ để đặt. Hệ thống kiểm tra trùng lịch và lưu booking.

---

## 🔄 Luồng chính (Main Flow)

| Bước | Actor   | Hành động                                      |
| ---- | ------- | ---------------------------------------------- |
| 1    | Player  | Mở trang booking                               |
| 2    | System  | Hiển thị form (Tên, SĐT, sân, ngày, khung giờ) |
| 3    | Player  | Nhập họ tên                                    |
| 4    | Player  | Nhập số điện thoại                             |
| 5    | Player  | Chọn sân                                       |
| 6    | Player  | Chọn ngày                                      |
| 7    | Player  | Chọn khung giờ                                 |
| 8    | Player  | Nhấn "Đặt sân"                                 |
| 9    | System  | Hiển thị loading                               |
| 10   | System  | Gửi POST /api/bookings                         |
| 11   | Backend | Validate dữ liệu                               |
| 12   | Backend | Kiểm tra slot có bị trùng                      |
| 13   | Backend | Lưu DB với status = "Booked"                   |
| 14   | Backend | Trả HTTP 201 + data                            |
| 15   | System  | Hiển thị "✅ Đặt sân thành công"                |
| 16   | System  | Reset form                                     |
| 17   | System  | Cập nhật danh sách                             |

---

## 🔀 Luồng thay thế (Alternative Flows)

### AF-01: Thiếu dữ liệu

* 8a.1 Player submit thiếu field
* 8a.2 Backend → 400
* 8a.3 UI hiển thị lỗi

---

### AF-02: Trùng lịch

* 12a.1 Slot đã tồn tại
* 12a.2 Backend → 409 Conflict
* 12a.3 UI: "❌ Khung giờ đã được đặt"

---

### AF-03: Lỗi mạng

* Request fail
* UI hiển thị lỗi kết nối

---

### AF-04: Lỗi server

* DB fail
* Backend → 500

---

## 📌 Postconditions

* Thành công: Booking được tạo
* Thất bại: Không ghi DB

---

## 📏 Business Rules

| ID    | Rule                                             |
| ----- | ------------------------------------------------ |
| BR-01 | Tất cả field bắt buộc                            |
| BR-02 | Không cho phép trùng (courtId + date + timeSlot) |
| BR-03 | Status mặc định = Booked                         |
| BR-04 | Không cho đặt quá khứ                            |

---

# 📌 UC-02: Xem danh sách booking

| Trường      | Nội dung      |
| ----------- | ------------- |
| Use Case ID | UC-02         |
| Actor       | Player, Admin |
| Ưu tiên     | Must Have     |

---

## 🧾 Mô tả

Hiển thị danh sách booking theo thời gian mới nhất.

---

## 🔄 Main Flow

| Bước | Actor   | Hành động         |
| ---- | ------- | ----------------- |
| 1    | Actor   | Mở trang          |
| 2    | System  | Auto fetch        |
| 3    | System  | GET /api/bookings |
| 4    | Backend | Query DB          |
| 5    | Backend | Return JSON       |
| 6    | System  | Render list       |

---

## 🔀 Alternative

### AF-01: Không có dữ liệu

* Hiển thị list rỗng

### AF-02: Lỗi fetch

* Hiển thị lỗi

---

## 📌 Extension

* Auto refresh sau khi đặt sân thành công

---

# 📌 UC-03: Kiểm tra trạng thái hệ thống

| Trường      | Nội dung       |
| ----------- | -------------- |
| Use Case ID | UC-03          |
| Actor       | Admin / DevOps |
| Mức độ      | Supporting     |

---

## 🔄 Main Flow

| Bước | Actor   | Hành động       |
| ---- | ------- | --------------- |
| 1    | Actor   | GET /api/health |
| 2    | Backend | Xử lý ngay      |
| 3    | Backend | Return 200      |

---

## 📌 Response

```json
{ "status": "Server is running" }
```

---

## 📌 Ghi chú

* Dùng cho Docker healthcheck
* Không query DB

---

# 📌 UC-04: Khởi tạo database

| Trường      | Nội dung    |
| ----------- | ----------- |
| Use Case ID | UC-04       |
| Actor       | System      |
| Mức độ      | System Goal |

---

## 🔄 Main Flow

| Bước | Actor  | Hành động            |
| ---- | ------ | -------------------- |
| 1    | System | Server start         |
| 2    | System | Connect DB           |
| 3    | DB     | Tạo bảng nếu chưa có |
| 4    | System | Release connection   |
| 5    | System | Log success          |
| 6    | System | Ready                |

---

## ❌ Luồng thất bại

* Không connect DB → stop server
* Log lỗi chi tiết

---

## 🎯 Tại sao quan trọng

* Tránh lỗi runtime
* Fail-fast khi start

---

# 📊 Bảng tóm tắt Use Cases

| UC    | Tên          | Actor        | Priority  | Status    |
| ----- | ------------ | ------------ | --------- | --------- |
| UC-01 | Đặt sân      | Player       | Must Have | ⏳ Planned |
| UC-02 | Xem booking  | Player/Admin | Must Have | ⏳ Planned |
| UC-03 | Health Check | Admin/System | Must Have | ⏳ Planned |
| UC-04 | Init DB      | System       | Must Have | ⏳ Planned |

---

# 🚀 Use Cases v3.0 (Future)

| UC    | Tên                    | Actor        | Version |
| ----- | ---------------------- | ------------ | ------- |
| UC-05 | Đăng nhập Admin        | Admin        | v3.0    |
| UC-06 | Approve/Reject booking | Admin        | v3.0    |
| UC-07 | Search & Filter        | Admin        | v3.0    |
| UC-08 | Email confirmation     | System       | v3.0    |
| UC-09 | Export CSV/Excel       | Admin        | v3.0    |
| UC-10 | Pagination             | Player/Admin | v3.0    |

---
