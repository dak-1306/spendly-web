# Spendly - web quản lý tài chính cá nhân

## Mô tả

Spendly là ứng dụng web giúp người dùng theo dõi thu chi, quản lý ngân sách, phân loại chi tiêu và nhận gợi ý/insight bằng AI.

## Tính năng chính

- Quản lý thu nhập và chi tiêu.
- Phân loại chi tiêu theo danh mục.
- Bảng điều khiển (dashboard) với biểu đồ/ thống kê.
- Quản lý ngân sách và cảnh báo vượt ngân sách.
- Xác thực người dùng (đăng ký/đăng nhập).
- Tích hợp AI để gợi ý tối ưu chi tiêu.

## Kiến trúc dự án

- frontend/
  - ứng dụng React (Vite + Tailwind).
  - Xem chi tiết: [frontend/README.md](frontend/README.md)
- backend/
  - API Node/Express (models, controllers, routes).
  - Xem chi tiết: [backend/README.md](backend/README.md)

## Công nghệ

- Frontend: React, Vite, Tailwind CSS, react-router, recharts
- Backend: Node.js, Express, MongoDB (hoặc DB bạn chọn), JWT cho auth
- Các thư viện khác: axios, clsx

## Bắt đầu

Yêu cầu:

- Node.js >= 18, npm hoặc pnpm/yarn
- MongoDB (hoặc chuỗi kết nối DB)

1. Cài đặt

- Frontend:
  ```sh
  cd frontend
  npm install
  ```
- Backend:
  ```sh
  cd backend
  npm install
  ```

2. Biến môi trường

- Backend: tạo file `.env` tương tự [backend/.env](backend/.env) (ví dụ: MONGO_URI, JWT_SECRET, PORT)
- Frontend: nếu cần, tạo `.env` trong `frontend/` (ví dụ: VITE_API_BASE_URL)

3. Chạy ứng dụng

- Backend (development):
  ```sh
  cd backend
  npm run dev
  ```
- Frontend (development):
  ```sh
  cd frontend
  npm run dev
  ```
# spendly-web
