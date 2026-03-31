

# 🎯 PRD — Pickleball Court Booking System

**Phiên bản:** 2.0 Draft + Roadmap v3.0
**Ngày:** 2026-03-24
**Phương pháp:** Scrum / Agile

---

# 1. 🧭 Tổng quan sản phẩm

## 1.1 Mục tiêu

Xây dựng hệ thống **quản lý & đặt sân Pickleball** giúp:

* Người chơi dễ dàng đặt sân online
* Chủ sân quản lý lịch, doanh thu, trạng thái sân
* Admin kiểm soát toàn bộ hệ thống

## 1.2 Problem Statement

Hiện tại:

* Đặt sân thủ công (Zalo, điện thoại) → dễ trùng lịch
* Không có tracking lịch sử booking
* Khó quản lý nhiều sân cùng lúc

👉 Hệ thống sẽ:

* Tự động hóa booking
* Đồng bộ thời gian thực
* Tối ưu vận hành

---

# 2. 👥 Stakeholders

| Role          | Mô tả               |
| ------------- | ------------------- |
| Player (User) | Người đặt sân       |
| Court Owner   | Chủ sân             |
| Admin         | Quản trị hệ thống   |
| Dev Team      | Phát triển hệ thống |

---

# 3. 🎯 Goals & Success Metrics

## 3.1 Goals

* 100% booking thực hiện qua hệ thống
* Giảm double booking xuống 0%
* UI đơn giản → booking < 1 phút

## 3.2 Metrics

* Conversion rate booking
* Số booking/ngày
* Thời gian hoàn thành booking
* Tỷ lệ lỗi API < 1%

---

# 4. 🧩 Phạm vi (Scope)

## 4.1 In Scope (v2.0)

* Booking sân
* Quản lý sân
* API backend + UI frontend
* Docker environment

## 4.2 Out of Scope (v2.0)

* Thanh toán online
* Mobile app
* AI recommendation

---

# 5. 🧱 EPIC & USER STORIES

---

## 🔥 EPIC 1: Core Booking Flow (v2.0)

---

### STORY-001: Setup Backend

🔴 Must Have | 3 points | ⬜ To Do

AS A developer
I WANT TO có backend Node.js chuẩn
SO THAT team dev nhanh và thống nhất

**Acceptance Criteria:**

* Cấu trúc: routes, controllers, services, models
* Server chạy với `npm run dev`
* Entry point tách riêng

---

### STORY-002: Database Connection Pool

🔴 Must Have | 3 points

AS A developer
I WANT TO connection pool
SO THAT handle concurrent booking

**Acceptance Criteria:**

* Pool config qua env
* Auto init schema
* Idempotent

---

### STORY-003: POST /api/bookings

🔴 Must Have | 5 points

AS A player
I WANT TO đặt sân
SO THAT giữ slot thời gian

**Request:**

```json
{
  "fullName": "Nguyen Van A",
  "phone": "0123456789",
  "courtId": 1,
  "date": "2026-03-25",
  "timeSlot": "18:00-19:00"
}
```

**Acceptance Criteria:**

* Validate đầy đủ fields
* Không cho phép trùng slot
* Status mặc định: `Booked`
* Return 201 + booking object
* Parameterized query

---

### STORY-004: GET /api/bookings

🔴 Must Have | 3 points

AS A admin
I WANT TO xem danh sách booking

**Acceptance Criteria:**

* Response: `{ total, data }`
* Sort newest
* Field đầy đủ

---

### STORY-005: GET /api/health

🔴 Must Have | 1 point

AS A devops
I WANT TO health check

**Acceptance Criteria:**

* Response < 50ms
* Không query DB

---

### STORY-006: Global Error Handler

🔴 Must Have | 2 points

**Acceptance Criteria:**

* 404 / 500 chuẩn JSON
* Validation errors rõ ràng

---

### STORY-007: Environment Config

🔴 Must Have | 2 points

**Acceptance Criteria:**

* dev / build config
* Không hardcode credentials

---

## 🎨 EPIC 2: Frontend (v2.0)

---

### STORY-008: Setup React + Vite

🔴 Must Have | 2 points

---

### STORY-009: Booking Form UI

🔴 Must Have | 5 points

AS A player
I WANT TO đặt sân qua web

**Fields:**

* Họ tên
* SĐT
* Sân
* Ngày
* Khung giờ

**Acceptance Criteria:**

* Controlled form
* Loading state
* Reset sau submit

---

### STORY-010: Booking List UI

🔴 Must Have | 3 points

AS A user/admin
I WANT TO xem danh sách

---

### STORY-011: CSP Security

🔴 Must Have | 1 point

---

## ⚙️ EPIC 3: Infrastructure & DevOps

---

### STORY-012: Dev DB Docker

🔴 Must Have | 3 points

---

### STORY-013: Fullstack Docker

🔴 Must Have | 5 points

---

### STORY-014: Backend Dockerfile

🔴 Must Have | 2 points

---

### STORY-015: Frontend Dockerfile

🔴 Must Have | 3 points

---

### STORY-016: Root Scripts

🟡 Should Have | 1 point

---

## 📚 EPIC 4: Documentation

---

### STORY-017: Onboarding Guide

🟡 Should Have | 2 points

---

### STORY-018: Troubleshooting

🟡 Should Have | 2 points

---

### STORY-019: Dev Guide

🟡 Should Have | 3 points

---

### STORY-020: Full Documentation

🟡 Should Have | 5 points

---

# 🚀 Roadmap v3.0

---

### STORY-021: Authentication (JWT)

⚪ Future | 8 points

---

### STORY-022: Approve/Reject Booking

⚪ Future | 5 points

---

### STORY-023: Pagination

⚪ Future | 5 points

---

### STORY-024: Search & Filter

⚪ Future | 5 points

---

### STORY-025: Email Notification

⚪ Future | 8 points

---

### STORY-026: Dashboard Analytics

⚪ Future | 8 points

---

# 📊 Sprint Planning

| Sprint   | Stories | Points | Nội dung     |
| -------- | ------- | ------ | ------------ |
| Sprint 1 | 001–007 | 19     | Backend core |
| Sprint 2 | 008–011 | 11     | Frontend     |
| Sprint 3 | 012–016 | 14     | DevOps       |
| Sprint 4 | 017–020 | 12     | Docs         |

**Total: 56 points**

---

# 📌 Definition of Ready (DoR)

* User story đúng format
* AC rõ ràng
* ≤ 8 points
* Dependencies resolved

---

# ✅ Definition of Done (DoD)

* Code chạy Dev + Docker
* Không hardcode secrets
* Pass lint/build
* Code review approved
* Update docs

---
