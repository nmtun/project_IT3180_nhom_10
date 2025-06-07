# Quản lý Chung cư BlueMoon

Hệ thống quản lý chung cư BlueMoon là một ứng dụng web giúp ban quản lý chung cư quản lý các thông tin về hộ gia đình, nhân khẩu, thu phí, tài khoản và các nghiệp vụ liên quan.

## Tính năng chính

- Quản lý hộ gia đình (phòng, loại phòng, chủ hộ, số thành viên, ghi chú)
- Quản lý nhân khẩu (thêm, sửa, xóa, tìm kiếm, phân loại tình trạng cư trú)
- Quản lý các loại phương tiện của các hộ gia đình
- Quản lý các loại phí, đợt thu phí, chi tiết thu phí từng hộ
- Quản lý tài khoản ban quản lý (phân quyền, trạng thái hoạt động)
- Thống kê, biểu đồ trực quan hóa dữ liệu
- Đăng nhập, phân quyền, bảo mật thông tin

## Cấu trúc thư mục

```
back-end/         # Server Node.js (Express, Sequelize)
  ├── src/
  │   ├── config/         # Cấu hình DB
  │   ├── controllers/    # Xử lý request API
  │   ├── models/         # ORM models
  │   ├── routes/         # Định nghĩa API routes
  │   ├── services/       # Xử lý logic nghiệp vụ
  │   ├── utils/          # Hàm tiện ích
  ├── index.js            # Điểm khởi động server
  ├── package.json
  └── .env                # Biến môi trường kết nối DB

front-end/        # Client ReactJS (Vite)
  ├── src/
  │   ├── pages/          # Các trang giao diện
  │   ├── components/     # Component dùng chung
  │   ├── styles/         # File CSS
  │   ├── utils/          # Hàm tiện ích, axios config
  │   └── assets/         # Ảnh, logo
  ├── index.html
  ├── package.json
  └── vite.config.js

database/         # Script tạo bảng, trigger, function SQL
docs/             # Tài liệu báo cáo, hướng dẫn
design/           # Sơ đồ, hình ảnh thiết kế
```

## Hướng Dẫn Cài Đặt và Khởi Chạy Phần Mềm

## Mục Lục

### 1. Yêu Cầu Hệ Thống

- Node.js (phiên bản 18.0.0 trở lên)
- MySQL (phiên bản 8.0 trở lên)
- npm hoặc yarn

### 2. Cài Đặt Backend

1. Cài đặt các dependencies
   ```bash
   cd back-end
   npm install
   ```
2. Cấu hình môi trường

   - Tạo file `.env` trong thư mục back-end
   - Cấu hình các biến môi trường cần thiết

3. Khởi chạy server
   ```bash
   npm run dev
   ```

### 3. Cài Đặt Frontend

1. Cài đặt các dependencies

   ```bash
   cd front-end
   npm install
   ```

2. Khởi chạy ứng dụng
   ```bash
   npm run dev
   ```

### 4. Các Dependencies Chính

#### Backend

- Express.js
- Sequelize (ORM)
- MySQL2
- JWT (JSON Web Token)
- Bcrypt
- CORS
- Helmet
- Morgan
- Dotenv

#### Frontend

- React
- Ant Design
- React Router DOM
- Axios
- Recharts
- React Icons

### 5. Cấu Trúc Thư Mục

```
project_IT3180_nhom_10/
├── back-end/
│   ├── src/
│   ├── test/
│   └── index.js
└── front-end/
    ├── src/
    ├── public/
    └── index.html
```

### 6. Xử Lý Lỗi Thường Gặp

- Kiểm tra phiên bản Node.js
- Kiểm tra kết nối database
- Kiểm tra các biến môi trường
- Kiểm tra port đang sử dụng

### 7. Liên Hệ Hỗ Trợ

[Thông tin liên hệ hỗ trợ]

## Công nghệ sử dụng

- **Backend:** Node.js, Express, Sequelize, MySQL
- **Frontend:** ReactJS, Vite, Axios, Recharts
- **Khác:** JWT, bcrypt, dotenv, morgan, helmet

## Đóng góp

Mọi đóng góp, báo lỗi hoặc đề xuất vui lòng gửi issue hoặc pull request.

---

**Tác giả:** Nhóm 10 - KTPM 2024-2.
