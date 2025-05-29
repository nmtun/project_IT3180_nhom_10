import React, { useState, useEffect } from 'react';
import '../styles/AddAccount.css';

const AddAccount = ({ open, onClose, onSubmit, initialData, mode }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    role: 'Tổ phó',
    status: 'Đang hoạt động',
  });

  useEffect(() => {
    if (!open) return; // Chỉ chạy khi modal mở

    if (mode === "edit" && initialData) {
      setForm({
        username: initialData.username || '',
        password: '',
        fullname: initialData.fullname || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        role: initialData.role || 'Tổ phó',
        status: initialData.status || 'Đang hoạt động',
      });
    } else if (mode === "add") {
      setForm({
        username: '',
        password: '',
        fullname: '',
        email: '',
        phoneNumber: '',
        role: 'Tổ phó',
        status: 'Đang hoạt động',
      });
    }
    // eslint-disable-next-line
  }, [open]); // Chỉ reset khi open thay đổi (tức là khi modal vừa mở)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...form };
    if (mode === "edit" && !form.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
    // Không reset form ở đây để giữ lại dữ liệu khi validate lỗi
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === "edit" ? 'Cập nhật tài khoản' : 'Thêm mới tài khoản'}</h2>
        <form onSubmit={handleSubmit} className="add-account-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Nhập email"
              required
            />
          </div>
          <div className="form-group">
            <label>Họ và tên</label>
            <input 
              type="text"
              name="fullname"
              value={form.fullname || ''}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber || ''}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <div className="form-group">
            <label>Vai trò</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              {/* <option value="Tổ trưởng">Tổ trưởng</option> */}
              <option value="Tổ phó">Tổ phó</option>
              <option value="Thủ quỹ">Thủ quỹ</option>
            </select>
          </div>
          {mode === "edit" && (
            <div className="form-group">
              <label>Trạng thái</label>
              <select
                name="status"
                value={form.status || 'Đang hoạt động'}
                onChange={handleChange}
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Đã nghỉ việc">Đã nghỉ việc</option>
              </select>
            </div>
          )}
          <div className="form-group">
            <label>
              Mật khẩu {mode === "edit" && <span style={{fontWeight: 400, fontSize: 13}}>(Để trống nếu không đổi)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              // required={mode === "add"}
            />
          </div>
          <div className="account-modal-actions">
            <button type="submit">
              {mode === "edit" ? "Cập nhật" : "Thêm mới"}
            </button>
            <button type="button" className="account-modal-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccount;