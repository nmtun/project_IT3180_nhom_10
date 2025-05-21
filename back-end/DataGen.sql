-- Thiết lập character set
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bảng Users
INSERT INTO Users (Username, Password, FullName, Email, PhoneNumber, Role, Status, CreatedAt, UpdateAt) VALUES
('admin', '$2b$10$4qGyCOe1PZPRzjV1IHFAzeIbpVX5yztDQ4Ol8LR7xlBepMPiGOdZ6', 'Administrator', 'admin@example.com', '0123456789', 'Tổ trưởng', 'Đang hoạt động', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('taphuc2', '$2b$10$5.2grn5D1VdZYyo3VVdBMOZxWLk8Z6cBYdcoJ1FZGKvRKA4WipcrS', 'Manager', 'manager@example.com', '0123456788', 'Tổ phó', 'Đang hoạt động', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('staff', '$2b$10$5.2grn5D1VdZYyo3VVdBMOZxWLk8Z6cBYdcoJ1FZGKvRKA4WipcrS', 'Staff', 'staff@example.com', '0123456787', 'Thủ quỹ', 'Đang hoạt động', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Bảng Households
INSERT INTO Households (RoomNumber, Type, Members, Notes, HouseholdHead) VALUES
('101', 'Đơn', 2, NULL, 'Phu'),
('201', 'Đôi', 3, NULL, 'Hung'),
('301', 'Đơn', 1, NULL, 'Tung');

-- 3. Bảng Residents
INSERT INTO Residents (HouseholdID, FullName, DateOfBirth, Sex, Relationship, PhoneNumber, EducationLevel, Occupation, ResidencyStatus, RegistrationDate) VALUES
(1, 'Nguyễn Văn A', '1980-01-01', 'Nam', 'Chủ hộ', '0123456781', 'Đại học', 'Kỹ sư', 'Thường trú', '2020-01-01'),
(1, 'Nguyễn Thị D', '1982-02-02', 'Nữ', 'Vợ/chồng', '0123456784', 'Đại học', 'Giáo viên', 'Thường trú', '2020-01-01'),
(2, 'Trần Thị B', '1985-03-03', 'Nữ', 'Chủ hộ', '0123456782', 'Cao đẳng', 'Kế toán', 'Thường trú', '2020-02-01'),
(3, 'Lê Văn C', '1988-04-04', 'Nam', 'Chủ hộ', '0123456783', 'Trung cấp', 'Thợ điện', 'Thường trú', '2020-03-01');

-- 4. Bảng Vehicles
INSERT INTO Vehicles (HouseholdID, LicensePlate, VehicleType, Brand, Color, RegistrationDate, Status) VALUES
(1, '30A-12345', 'Xe máy', 'Honda', 'Đen', '2024-01-01', 'Còn hạn đăng ký gửi'),
(1, '30A-12346', 'Ô tô', 'Toyota', 'Trắng', '2024-01-01', 'Còn hạn đăng ký gửi'),
(2, '30A-12347', 'Xe máy', 'Yamaha', 'Đỏ', '2024-01-01', 'Còn hạn đăng ký gửi'),
(3, '30A-12348', 'Ô tô', 'Honda', 'Bạc', '2024-01-01', 'Còn hạn đăng ký gửi');

-- 5. Bảng FeeTypes
INSERT INTO FeeTypes (name, description, amount, isActive) VALUES
('Phí quản lý', 'Phí quản lý chung cư hàng tháng', 500000.00, 1),
('Phí gửi xe', 'Phí gửi xe tháng', 200000.00, 1),
('Phí vệ sinh', 'Phí vệ sinh môi trường', 100000.00, 1),
('Phí bảo trì', 'Phí bảo trì cơ sở vật chất', 300000.00, 1),
('Phí điện', 'Phí điện chung', 150000.00, 1);

-- 6. Bảng FeeCollections
INSERT INTO FeeCollections (FeeTypeID, CollectionName, StartDate, EndDate, TotalAmount, Status, Notes) VALUES
(1, 'Thu phí quản lý tháng 3/2024', '2024-03-01', '2024-03-31', 5000000.00, 'Đang thu', 'Thu phí quản lý tháng 3'),
(2, 'Thu phí gửi xe tháng 3/2024', '2024-03-01', '2024-03-31', 2000000.00, 'Đang thu', 'Thu phí gửi xe tháng 3'),
(3, 'Thu phí vệ sinh tháng 3/2024', '2024-03-01', '2024-03-31', 1000000.00, 'Đang thu', 'Thu phí vệ sinh tháng 3'),
(4, 'Thu phí bảo trì Q1/2024', '2024-01-01', '2024-03-31', 3000000.00, 'Hoàn thành', 'Thu phí bảo trì quý 1'),
(5, 'Thu phí điện tháng 2/2024', '2024-02-01', '2024-02-29', 1500000.00, 'Kết thúc', 'Thu phí điện tháng 2');

-- 7. Bảng FeeDetails
INSERT INTO FeeDetails (CollectionID, HouseholdID, AmountDue, AmountPaid, PaymentDate, PaymentMethod, PaymentStatus, Notes) VALUES
-- Phí quản lý tháng 3
(1, 1, 500000.00, 500000.00, '2024-03-05', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(1, 2, 500000.00, 0.00, NULL, 'Tiền mặt', 'Chưa đóng', NULL),
(1, 3, 500000.00, 500000.00, '2024-03-10', 'Tiền mặt', 'Đã đóng', 'Đã thanh toán đầy đủ'),

-- Phí gửi xe tháng 3
(2, 1, 200000.00, 200000.00, '2024-03-06', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(2, 2, 200000.00, 0.00, NULL, 'Tiền mặt', 'Chưa đóng', NULL),
(2, 3, 200000.00, 200000.00, '2024-03-11', 'Tiền mặt', 'Đã đóng', 'Đã thanh toán đầy đủ'),

-- Phí vệ sinh tháng 3
(3, 1, 100000.00, 100000.00, '2024-03-07', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(3, 2, 100000.00, 0.00, NULL, 'Tiền mặt', 'Chưa đóng', NULL),
(3, 3, 100000.00, 100000.00, '2024-03-12', 'Tiền mặt', 'Đã đóng', 'Đã thanh toán đầy đủ'),

-- Phí bảo trì Q1
(4, 1, 300000.00, 300000.00, '2024-01-15', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(4, 2, 300000.00, 300000.00, '2024-01-20', 'Tiền mặt', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(4, 3, 300000.00, 300000.00, '2024-01-25', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ'),

-- Phí điện tháng 2
(5, 1, 150000.00, 150000.00, '2024-02-28', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(5, 2, 150000.00, 150000.00, '2024-02-28', 'Tiền mặt', 'Đã đóng', 'Đã thanh toán đầy đủ'),
(5, 3, 150000.00, 150000.00, '2024-02-28', 'Chuyển khoản', 'Đã đóng', 'Đã thanh toán đầy đủ');

SET FOREIGN_KEY_CHECKS = 1;