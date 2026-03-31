

👉 **Pickleball Court Booking System — Core Booking Module**

---

# 📄 SRS — Software Requirements Specification

## Pickleball Court Booking System — Core Booking Module

---

## Trường | Nội dung

**Tài liệu** | Software Requirements Specification
**Phiên bản** | 1.0
**Trạng thái** | Draft
**Chuẩn tham chiếu** | IEEE 830
**Ngày** | 2026-03-24

---

# Mục lục

1. Giới thiệu
2. Tổng quan hệ thống
3. Yêu cầu chức năng
4. Yêu cầu phi chức năng
5. Đặc tả API
6. Đặc tả Database
7. Đặc tả môi trường triển khai
8. Ràng buộc thiết kế
9. Ma trận truy vết yêu cầu

---

# 1. Giới thiệu

## 1.1 Mục đích tài liệu

Tài liệu này mô tả đầy đủ các yêu cầu phần mềm cho hệ thống **Pickleball Court Booking System**, bao gồm:

* Yêu cầu chức năng
* Yêu cầu phi chức năng
* API
* Database
* Kiến trúc & ràng buộc kỹ thuật

👉 Là cơ sở cho thiết kế, phát triển và kiểm thử hệ thống.

---

## 1.2 Phạm vi hệ thống

Hệ thống gồm:

* **Backend API**

  * Node.js / Express hoặc NestJS
  * Xử lý business logic & booking

* **Frontend Web**

  * React SPA (Vite)
  * Giao diện người dùng

---

## 1.3 Định nghĩa và từ viết tắt

| Thuật ngữ            | Định nghĩa                           |
| -------------------- | ------------------------------------ |
| API                  | Application Programming Interface    |
| SPA                  | Single Page Application              |
| REST                 | Kiến trúc API                        |
| CSP                  | Content Security Policy              |
| Connection Pool      | Tập hợp kết nối DB                   |
| Prepared Statement   | SQL parameterized                    |
| Layered Architecture | Route → Controller → Service → Model |

---

# 2. Tổng quan hệ thống

---

## 2.1 Kiến trúc tổng thể

```
Client (React SPA)
    │
    ▼
REST API (Node.js Backend)
    │
    ▼
Database (PostgreSQL/MySQL)
```

---

## 2.2 Kiến trúc Backend — Layered Architecture

```
[ Routes ]
   ↓
[ Controller ]
   ↓
[ Service ]
   ↓
[ Model ]
   ↓
[ Database ]
```

---

## 2.3 Luồng dữ liệu

```
Browser → Request JSON → Controller
→ Service (validate + business logic)
→ Model → Database
← Response JSON ← Browser
```

---

# 3. Yêu cầu chức năng

---

## FR-01: Đặt sân

**ID:** FR-01
**Ưu tiên:** Must Have

---

### FR-01.1 — Input

POST `/api/bookings`

```json
{
  "customerName": "string, bắt buộc",
  "email": "string, hợp lệ",
  "courtId": "number",
  "startTime": "ISO datetime",
  "endTime": "ISO datetime"
}
```

---

### FR-01.2 — Validation rules

| Trường       | Rule         | Lỗi |
| ------------ | ------------ | --- |
| customerName | Không rỗng   | 400 |
| email        | Đúng format  | 400 |
| time         | Không trùng  | 400 |
| courtId      | Phải tồn tại | 400 |

---

### FR-01.3 — Business rules

* Không cho phép **double booking**
* Kiểm tra overlap thời gian
* Slot phải thuộc giờ hoạt động

---

### FR-01.4 — Lưu trữ

* status = `Pending`
* created_at = current timestamp

---

### FR-01.5 — Output

```json
HTTP 201
{
  "message": "Đặt sân thành công!",
  "data": {
    "id": 1,
    "customerName": "Nguyen Van A",
    "courtId": 1,
    "status": "Pending"
  }
}
```

---

## FR-02: Lấy danh sách booking

**ID:** FR-02

GET `/api/bookings`

---

### Output

```json
{
  "total": 1,
  "data": [
    {
      "id": 1,
      "customerName": "Nguyen Van A",
      "courtId": 1,
      "status": "Pending",
      "startTime": "...",
      "endTime": "..."
    }
  ]
}
```

---

### Rule

* Sắp xếp theo **created_at DESC**

---

## FR-03: Xem lịch trống

**ID:** FR-03

GET `/api/courts/:id/slots`

---

### Output

* Danh sách slot:

  * Available
  * Booked

---

## FR-04: Health Check

GET `/api/health`

```json
{ "status": "OK" }
```

---

## FR-05: Xử lý lỗi toàn cục

| Case         | Status | Response |
| ------------ | ------ | -------- |
| Not found    | 404    | message  |
| Validation   | 400    | message  |
| Server error | 500    | message  |

---

## FR-06: Form Booking (Frontend)

* Input:

  * Name
  * Email
  * Time
* Loading state
* Success / error message
* Reset form

---

## FR-07: Danh sách booking (Frontend)

* Auto load khi mở trang
* Refresh sau booking
* Hiển thị loading/error

---

# 4. Yêu cầu phi chức năng

---

## NFR-01: Hiệu năng

| Yêu cầu          | Giá trị |
| ---------------- | ------- |
| API response     | < 1s    |
| Concurrent users | 1000+   |

---

## NFR-02: Bảo mật

* Parameterized queries
* Validate input
* CORS config
* Không hardcode secrets

---

## NFR-03: Đồng bộ (Concurrency)

* Tránh race condition
* Sử dụng:

  * DB transaction
  * Redis lock (optional)

---

## NFR-04: Maintainability

* Clean architecture
* Tách layer rõ ràng
* Config theo environment

---

## NFR-05: Portability

* Dockerized
* Chạy được:

  * Windows
  * Linux

---

# 5. Đặc tả API

---

## Base URL

| Env   | URL                                            |
| ----- | ---------------------------------------------- |
| Dev   | [http://localhost:5000](http://localhost:5000) |
| Build | [http://localhost:5001](http://localhost:5001) |

---

## Endpoint: POST /api/bookings

### Request

```json
{
  "customerName": "A",
  "email": "a@gmail.com",
  "courtId": 1,
  "startTime": "...",
  "endTime": "..."
}
```

---

### Response

```json
201 Created
{
  "message": "Success"
}
```

---

## Endpoint: GET /api/bookings

```json
200 OK
{
  "total": 1,
  "data": []
}
```

---

## Endpoint: GET /api/health

```json
{ "status": "OK" }
```

---

# 6. Đặc tả Database

---

## Bảng: courts

```sql
CREATE TABLE courts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  location VARCHAR(255)
);
```

---

## Bảng: bookings

```sql
CREATE TABLE bookings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255),
  email VARCHAR(255),
  court_id BIGINT,
  start_time DATETIME,
  end_time DATETIME,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Rule quan trọng

👉 Không được overlap:

```sql
(start_time < existing_end)
AND (end_time > existing_start)
```

---

# 7. Môi trường triển khai

---

## Dev

| Service  | Port |
| -------- | ---- |
| Backend  | 5000 |
| Frontend | 5173 |
| DB       | 3306 |

---

## Build (Docker)

| Service  | Port |
| -------- | ---- |
| Backend  | 5001 |
| Frontend | 5174 |

---

# 8. Ràng buộc thiết kế

---

## 8.1 Environment config

* Load config trước khi start app

---

## 8.2 SQL security

* Bắt buộc prepared statement

---

## 8.3 Anti double booking

* DB transaction
* Lock logic

---

## 8.4 Docker port mapping

* HOST:CONTAINER phải khớp

---

## 8.5 CSP

* Cho phép connect backend

---

# 9. Ma trận truy vết yêu cầu

| Requirement | Mô tả        | Component          |
| ----------- | ------------ | ------------------ |
| FR-01       | Booking      | POST /api/bookings |
| FR-02       | List booking | GET /api/bookings  |
| FR-03       | Slot         | GET /courts/:id    |
| FR-04       | Health       | /api/health        |
| FR-05       | Error        | Middleware         |
| FR-06       | Form UI      | Frontend           |
| FR-07       | List UI      | Frontend           |
| NFR-02      | Security     | Model              |
| NFR-03      | Concurrency  | Service            |

---

