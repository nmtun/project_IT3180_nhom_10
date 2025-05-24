import React, { useState, useEffect } from 'react';
import '../styles/AddAccount.css';

const AddAccount = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    role: 'Tổ phó', // hoặc giá trị mặc định hợp lệ
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username || '',
        password: '',
        fullname: initialData.fullname || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        role: initialData.role || 'Tổ phó',
      });
    } else {
      setForm({
        username: '',
        password: '',
        fullname: '',
        email: '',
        phoneNumber: '',
        role: 'Tổ phó', // hoặc giá trị mặc định hợp lệ
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Nếu không nhập mật khẩu khi sửa, không gửi trường password
    const submitData = { ...form };
    if (initialData && !form.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
    setForm({
        username: '',
        password: '',
        fullname: '',
        email: '',
        phoneNumber: '',
        role: 'Tổ trưởng', // hoặc giá trị mặc định hợp lệ
    });  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Cập nhật tài khoản' : 'Thêm mới tài khoản'}</h2>
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
              <option value="Tổ trưởng">Tổ trưởng</option>
              <option value="Tổ phó">Tổ phó</option>
              <option value="Thủ quỹ">Thủ quỹ</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mật khẩu {initialData && <span style={{fontWeight: 400, fontSize: 13}}>(Để trống nếu không đổi)</span>}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              // required={!initialData} // Không bắt buộc khi sửa
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-submit">
              {initialData ? 'Cập nhật' : 'Thêm'}
            </button>
            <button type="button" className="modal-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccount;