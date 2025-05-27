/* eslint-disable no-unused-vars */
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosIntance from '../untils/axiosIntance';
import Toast from '../components/Toast';
import { validateEmail, validatePassword, validatePhoneNumber } from '../untils/helper';
import '../styles/Profile.css';

const Profile = () => {
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [showEdit, setShowEdit] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(null);
  const [editForm, setEditForm] = React.useState({});
  const [toast, setToast] = React.useState({ message: '', type: 'info' });

  // Lấy userId từ localStorage hoặc context (giả sử lưu userId khi đăng nhập)
  const userId = localStorage.getItem('id');

  // Lấy dữ liệu user thực tế từ backend khi load trang
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosIntance.get(`/users/get-user-by-id/${userId}`);
        setUserInfo(res.data.user);
      } catch (error) {
        setToast({ message: 'Không lấy được thông tin người dùng!', type: 'error' });
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // Khi mở form sửa, đồng bộ dữ liệu
  React.useEffect(() => {
    if (showEdit && userInfo) setEditForm({ Username: '', Email: '', Password: '' });
  }, [showEdit, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(editForm.Email || '')) {
      setToast({ message: 'Email không hợp lệ!', type: 'error' });
      return;
    }

    // Validate phone number
    if (!validatePhoneNumber(editForm.PhoneNumber || '')) {
      setToast({ message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0!', type: 'error' });
      return;
    }

    // Validate password nếu có nhập
    if (editForm.Password && editForm.Password.trim() !== '') {
      if (!validatePassword(editForm.Password)) {
        setToast({ message: 'Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt!', type: 'error' });
        return;
      }
    }

    try {
      // Chỉ gửi các trường cần cập nhật
      const updateData = {
        Email: editForm.Email,
        PhoneNumber: editForm.PhoneNumber,
      };
      if (editForm.Password && editForm.Password.trim() !== '') {
        updateData.Password = editForm.Password;
      }
      await axiosIntance.put(`/users/update-user/${userId}`, updateData);
      setUserInfo({ ...userInfo, ...updateData });
      setShowEdit(false);
      setToast({ message: 'Cập nhật thông tin thành công!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Cập nhật thất bại!', type: 'error' });
    }
  };

  if (!userInfo) return <div>Đang tải thông tin...</div>;

  return (
    <div className="settings-container">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
      <Header />
      <div className="settings-body">
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`settings-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Thông tin tài khoản của bạn</h1>
          <div className="profile-info">
            <p><b>Họ và tên:</b> {userInfo.FullName}</p>
            <p><b>Tên đăng nhập:</b> {userInfo.Username}</p>
            <p><b>Email:</b> {userInfo.Email}</p>
            <p><b>Số điện thoại:</b> {userInfo.PhoneNumber}</p>
            <p><b>Vai trò:</b> {userInfo.Role}</p>
            <button
              className="profile-edit-btn"
              onClick={() => setShowEdit(v => !v)}
              style={{ marginTop: 18 }}
            >
              {showEdit ? "Đóng" : "Cập nhật thông tin"}
            </button>
          </div>
          {showEdit && (
            <form className="profile-edit-form" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="Email"
                  value={editForm.Email || ''}
                  placeholder="Nhập email mới"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={editForm.PhoneNumber || ''}
                  placeholder="Nhập số điện thoại mới"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>
                  Mật khẩu:
                  <span className="input-note"> (để trống nếu không muốn thay đổi)</span>
                </label>
                <input
                  type="password"
                  name="Password"
                  value={editForm.Password || ''}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <button type="submit" style={{ marginTop: 12 }}>Lưu thay đổi</button>
            </form>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Profile;