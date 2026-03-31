# 📄 Phần A — Tài liệu Dự án

## Pickleball Court Booking System — v2.0

---

## A.1 Thông tin sinh viên

| Trường             | Nội dung                        |
|--------------------|---------------------------------|
| **Họ và tên**      | Đỗ Thành Linh                   |
| **Mã số sinh viên**| 2251220044                      |
| **Lớp**            | 22Ct1                           |
| **Môn học**        | Thực hành DevOps / Phát triển Web |
| **Năm học**        | 2025 – 2026                     |

---

## A.2 Giới thiệu ứng dụng

### Mục đích

Hệ thống **Pickleball Court Booking** giải quyết bài toán đặt sân thể thao thủ công:

- Hiện tại: người chơi liên hệ qua Zalo/điện thoại → dễ trùng lịch, sai sót
- Giải pháp: web app đặt sân trực tuyến **realtime**, có phân quyền, chống double-booking

### Người dùng mục tiêu

| Nhóm      | Mô tả                                      |
|-----------|--------------------------------------------|
| **Player**| Người chơi 18–45 tuổi, dùng smartphone, muốn đặt sân nhanh |
| **Admin** | Quản lý sân: quản lý lịch, booking, người dùng, sân |

### Phạm vi phiên bản 2.0

**✅ Có trong v2.0:**
- Đăng ký / Đăng nhập (JWT authentication)
- Phân quyền: User & Admin
- Đặt sân online (booking form + slot calendar)
- Admin dashboard: quản lý booking, user, court
- User dashboard: lịch sử booking cá nhân
- Health check API
- Trang About sinh viên
- Docker-ready

**❌ Chưa có (Future v3.0):**
- Thanh toán online
- Email notification
- Mobile app
- Dashboard analytics nâng cao

---

## A.3 Tính năng

### Backend API

| Endpoint                        | Method | Auth     | Mô tả                          |
|---------------------------------|--------|----------|--------------------------------|
| `/health`                       | GET    | Public   | Health check → `{status:"ok"}` |
| `/api/about`                    | GET    | Public   | Thông tin sinh viên            |
| `/api/auth/register`            | POST   | Public   | Đăng ký tài khoản              |
| `/api/auth/login`               | POST   | Public   | Đăng nhập → JWT token          |
| `/api/auth/me`                  | GET    | 🔐 User  | Lấy thông tin profile          |
| `/api/courts`                   | GET    | Public   | Danh sách sân                  |
| `/api/courts/:id/slots`         | GET    | Public   | Lịch trống theo ngày           |
| `/api/courts`                   | POST   | 👑 Admin | Tạo sân mới                    |
| `/api/courts/:id`               | PUT    | 👑 Admin | Cập nhật sân                   |
| `/api/courts/:id`               | DELETE | 👑 Admin | Xóa sân                        |
| `/api/bookings`                 | GET    | 🔐 User  | Xem booking (admin: all, user: own) |
| `/api/bookings`                 | POST   | 🔐 User  | Tạo booking mới                |
| `/api/bookings/:id/status`      | PUT    | 👑 Admin | Cập nhật trạng thái booking    |
| `/api/bookings/:id`             | DELETE | 👑 Admin | Xóa booking                    |
| `/api/users`                    | GET    | 👑 Admin | Danh sách người dùng           |
| `/api/users/stats`              | GET    | 👑 Admin | Thống kê hệ thống              |
| `/api/users/:id`                | PUT    | 👑 Admin | Cập nhật user                  |
| `/api/users/:id/toggle`         | PATCH  | 👑 Admin | Khóa/mở khóa tài khoản        |
| `/api/users/:id`                | DELETE | 👑 Admin | Xóa người dùng                 |

### Frontend Pages

| Route        | Trang                 | Quyền      |
|--------------|-----------------------|------------|
| `/`          | Trang chủ (slot + booking form) | Public |
| `/bookings`  | Danh sách booking     | Public     |
| `/about`     | Thông tin sinh viên   | Public     |
| `/login`     | Đăng nhập             | Public     |
| `/register`  | Đăng ký               | Public     |
| `/dashboard` | Dashboard người dùng  | 🔐 User    |
| `/admin`     | Admin Dashboard       | 👑 Admin   |

---

## A.4 Use Cases

### UC-01: Đặt sân — Player

```
Actor: Player (đã đăng nhập)
Luồng chính:
  1. Mở trang chủ /
  2. Chọn sân + ngày → xem slot trống (xanh) / đã đặt (đỏ)
  3. Click slot trống → auto điền vào form
  4. Điền họ tên, SĐT → nhấn "Đặt sân ngay"
  5. Hệ thống validate → lưu DB → trả 201
  6. UI hiển thị "✅ Đặt sân thành công"
  7. Slot chuyển sang "Đã đặt"

Luồng thay thế:
  - AF-01: Thiếu field → 400 + error list
  - AF-02: Slot đã đặt → 409 Conflict
  - AF-03: Ngày quá khứ → 400 Bad Request
```

### UC-02: Xem booking — User Dashboard

```
Actor: Player (đã đăng nhập)
Luồng:
  1. Vào /dashboard
  2. Hệ thống fetch GET /api/bookings (filter theo userId)
  3. Hiển thị bảng: sân, ngày, giờ, trạng thái
  4. Có thể chuyển tab → đặt sân mới
```

### UC-03: Quản lý hệ thống — Admin

```
Actor: Admin
Luồng:
  1. Đăng nhập admin@gmail.com / admin12345
  2. Redirect → /admin (Admin Dashboard)
  3. Tab "Tổng quan": xem stats (users, bookings, courts)
  4. Tab "Bookings": xem tất cả booking, confirm/cancel/delete
  5. Tab "Người dùng": xem list user, lock/unlock, delete
  6. Tab "Sân": thêm/sửa/xóa sân
```

### UC-04: Xác thực (Authentication)

```
Actor: Visitor
Register:
  POST /api/auth/register { fullName, email, password }
  → 201 + JWT token + user info

Login:
  POST /api/auth/login { email, password }
  → 200 + JWT token + user info (role: user|admin)

Protected resource:
  GET /api/bookings
  Headers: Authorization: Bearer <token>
  → user sees own bookings, admin sees all
```

### UC-05: Trang About

```
Actor: Visitor / Giảng viên
Route: /about
Hiển thị:
  - Họ tên: Đỗ Thành Linh
  - MSSV: 2251220044
  - Lớp: 22Ct1
  - Tech stack, API endpoints
```

### UC-06: Health Check

```
Actor: DevOps / Docker
GET /health
→ 200 { "status": "ok" } (< 50ms, không query DB)
```

---

## A.5 Kiến trúc backend (Controller - Service - Repository)

```
Request
  ↓
Route (định nghĩa endpoint + middleware)
  ↓
Validator (kiểm tra input)
  ↓
Auth Middleware (xác thực JWT)
  ↓
Controller (nhận/trả HTTP)
  ↓
Service (business logic)
  ↓
Repository (truy vấn MongoDB)
  ↓
Model (Mongoose Schema)
  ↓
MongoDB Atlas
```

### Cấu trúc thư mục

```
backend/
├── src/
│   ├── controllers/       # Xử lý yêu cầu HTTP
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── booking.controller.js
│   │   └── court.controller.js
│   ├── services/          # Xử lý nghiệp vụ (business logic)
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── booking.service.js
│   │   └── court.service.js
│   ├── repositories/      # Truy vấn cơ sở dữ liệu
│   │   ├── user.repository.js
│   │   ├── booking.repository.js
│   │   └── court.repository.js
│   ├── routes/            # Định nghĩa đường dẫn API
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── booking.routes.js
│   │   ├── court.routes.js
│   │   └── index.js
│   ├── middlewares/       # Xử lý trung gian
│   │   ├── auth.middleware.js    (JWT verify + role check)
│   │   └── error.middleware.js  (Global error handler)
│   ├── validators/        # Kiểm tra dữ liệu đầu vào
│   │   ├── auth.validator.js
│   │   └── booking.validator.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   └── Court.js
│   ├── config/
│   │   └── db.js
│   └── app.js
├── server.js
├── .env
└── package.json
```

---

## A.6 Tài khoản mặc định

| Role  | Email              | Mật khẩu    |
|-------|--------------------|-------------|
| Admin | admin@gmail.com    | admin12345  |

> Admin được tạo tự động khi server khởi động lần đầu.

---

## A.7 Hướng dẫn chạy

### Cách 1: Chạy local (Development)

```bash
# 1. Clone / download project

# 2. Cài backend
cd backend
npm install
npm run dev        # http://localhost:5000

# 3. Cài frontend
cd frontend
npm install
npm run dev        # http://localhost:5173

# 4. Mở trình duyệt: http://localhost:5173
```

### Cách 2: Chạy bằng Docker Compose (Production)

```bash
# 1. Copy file môi trường
cp .env.example .env

# 2. Khởi động toàn bộ hệ thống (MongoDB + Backend + Frontend)
docker-compose up -d

# 3. Kiểm tra các container đang chạy
docker-compose ps

# 4. Mở trình duyệt:
#    Frontend:     http://localhost:5174
#    Backend API:  http://localhost:5000
#    Health check: http://localhost:5000/health

# 5. Dừng hệ thống
docker-compose down
```

---

## B. Minh chứng

### B.1 Link Docker Hub

| Image | Link |
|-------|------|
| **Backend** | https://hub.docker.com/r/thanhlinhit/pickleball-backend |
| **Frontend** | https://hub.docker.com/r/thanhlinhit/pickleball-frontend |

### B.2 Kéo image từ Docker Hub

```bash
docker pull thanhlinhit/pickleball-backend:latest
docker pull thanhlinhit/pickleball-frontend:latest
```

### B.3 Checklist Docker

| # | Yêu cầu | Trạng thái |
|---|---------|------------|
| 5 | Dockerfile cho Backend | ✅ `backend/Dockerfile` |
| 5 | Dockerfile cho Frontend | ✅ `frontend/Dockerfile` |
| 5 | Database chạy container riêng | ✅ MongoDB service trong compose |
| 6 | File `docker-compose.yml` | ✅ BE + FE + DB đầy đủ |
| 7 | Push lên Docker Hub | ✅ `thanhlinhit/pickleball-backend` & `pickleball-frontend` |

---

*Tài liệu: Đỗ Thành Linh — 2251220044 — 22Ct1 — 2026*
