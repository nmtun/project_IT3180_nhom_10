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

## Hướng dẫn cài đặt & chạy dự án

### 1. Khởi tạo cơ sở dữ liệu

- Tạo database MySQL

### 2. Chạy backend (API server)

```sh
cd back-end
npm install
npm start
```
- Cấu hình kết nối DB trong file `.env` (xem mẫu `.env.example`).
- Khi server kết nối với DB và chạy thành công, sequelize sẽ tự động tạo các bảng liên quan cho bạn.
- Sau đó hãy import các function và trigger liên quan.
  - `function.sql`
  - `trigger.sql`

### 3. Chạy frontend (React client)

```sh
cd front-end
npm install
npm run dev
```
- Truy cập [http://localhost:5173](http://localhost:5173) (hoặc port Vite báo).

## Công nghệ sử dụng

- **Backend:** Node.js, Express, Sequelize, MySQL
- **Frontend:** ReactJS, Vite, Axios, Recharts
- **Khác:** JWT, bcrypt, dotenv, morgan, helmet

## Đóng góp

Mọi đóng góp, báo lỗi hoặc đề xuất vui lòng gửi issue hoặc pull request.

---

**Tác giả:** Nhóm 10 - KTPM 2024-2.  


