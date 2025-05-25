/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../styles/Account.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import AddAccount from '../components/AddAccount'; 
import axiosIntance from '../untils/axiosIntance'; 
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import Toast from '../components/Toast';

const Account = () => {
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [search, setSearch] = React.useState('');
  const [showAddAccount, setShowAddAccount] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const [editAccount, setEditAccount] = React.useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleDeleteAccount = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    try {
      await axiosIntance.delete(`/users/delete-user/${id}`);
      await fetchAccounts();
      setToast({ message: 'Xóa tài khoản thành công!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Xóa tài khoản thất bại!', type: 'error' });
    }
  };

  // Lấy danh sách tài khoản (giả lập hoặc từ API)
  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axiosIntance.get('/users/get-all-user');
      // Chuyển đổi key về camelCase cho frontend dễ dùng
      const users = (res.data.users || res.data).map(acc => ({
        id: acc.UserID,
        username: acc.Username,
        fullname: acc.FullName,
        email: acc.Email,
        phoneNumber: acc.PhoneNumber,
        role: acc.Role,
        status: acc.Status,
      }));
      setAccounts(users);
    } catch {
      setAccounts([]);
    }
  };

  // Xử lý thêm tài khoản
  const handleAddAccount = async (data) => {
    try {
      console.log(data);
      const response = await axiosIntance.post('/users/create-user', {
        Username: data.username,
        Password: data.password,
        FullName: data.fullname,
        Email: data.email,
        PhoneNumber: data.phoneNumber,
        Role: data.role,
        //Status: data.status, 
      });
      console.log(response.data);
      // eslint-disable-next-line no-unused-vars
      const newAccount = response.data.newAccount || response.data;
      await fetchAccounts();
      setShowAddAccount(false);
      setToast({ message: 'Thêm tài khoản thành công!', type: 'success' });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Thêm tài khoản thất bại!', type: 'error' });
    }
  };

  // Xử lý chỉnh sửa tài khoản
  const handleEditAccount = async (data) => {
    try {
      const payload = {
        Username: data.username,
        FullName: data.fullname,
        Email: data.email,
        PhoneNumber: data.phoneNumber,
        Role: data.role,
        Status: data.status, 
      };
      // Nếu có nhập mật khẩu mới thì gửi lên
      if (data.password) {
        payload.Password = data.password;
      }
      await axiosIntance.put(`/users/update-user/${editAccount.id}`, payload);
      setEditAccount(null);
      await fetchAccounts();
      setToast({ message: 'Cập nhật tài khoản thành công!', type: 'success' });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setToast({ message: 'Cập nhật tài khoản thất bại!', type: 'error' });
    }
  };

  // Lọc theo search
  const filteredAccounts = accounts.filter(
    acc =>
      acc.role?.toLowerCase() !== 'tổ trưởng' && (
        acc.fullname?.toLowerCase().includes(search.toLowerCase()) ||
        acc.email?.toLowerCase().includes(search.toLowerCase()) ||
        acc.role?.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
      <div className="account-container">
        <Header />
        <div className="account-body">
          <Sidebar open={open} setOpen={setOpen} />
          <div className={`account-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="account-title">
              <h1 className="account-title-text">Danh sách tài khoản:</h1>
              <div className="account-search">
                <SearchBar 
                  placeholder={"Tìm kiếm người dùng..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="account-list">
              {filteredAccounts.map((acc, idx) => (
                <div
                  className="account-row"
                  key={acc.id || idx}
                  onClick={() => setSelectedUser(acc)}
                  style={{ cursor: 'pointer' }}
                >
                  <span><b>Họ và tên: </b>{acc.fullname}</span>
                  <span><b>Email: </b>{acc.email}</span>
                  <span><b>Vai trò: </b>{acc.role}</span>
                  <span>
                    <b>Trạng thái: </b>
                    <span className={acc.status === "Đang hoạt động" ? "status-active" : "status-inactive"}>
                      {acc.status}
                    </span>
                  </span>
                  <span className="account-actions" onClick={e => e.stopPropagation()}>
                    <FaEdit
                      className="icon-action edit"
                      title="Sửa"
                      onClick={() => setEditAccount(acc)}
                    />
                    <FaTrash
                      className="icon-action delete"
                      title="Xóa"
                      onClick={() => handleDeleteAccount(acc.id)}
                    />
                  </span>
                </div>
              ))}
              {filteredAccounts.length === 0 && (
                <div className="account-row">Không có tài khoản nào.</div>
              )}
            </div>
            {/* Modal hiển thị chi tiết user */}
            {selectedUser && (
              <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <h2>Chi tiết tài khoản</h2>
                  <p><b>Tên đăng nhập:</b> {selectedUser.username}</p>
                  <p><b>Họ và tên:</b> {selectedUser.fullname}</p>
                  <p><b>Email:</b> {selectedUser.email}</p>
                  <p><b>Số điện thoại:</b> {selectedUser.phoneNumber}</p>
                  <p><b>Vai trò:</b> {selectedUser.role}</p>
                  <p>
                    <b>Trạng thái:</b>
                    <span className={selectedUser.status === "Đang hoạt động" ? "status-active" : "status-inactive"}>
                      {selectedUser.status}
                    </span>
                  </p>
                  <button className="modal-cancel" onClick={() => setSelectedUser(null)}>Đóng</button>
                </div>
              </div>
            )}
            <AddButton onClick={() => setShowAddAccount(true)} />
            <AddAccount
              open={showAddAccount || !!editAccount}
              onClose={() => {
                setShowAddAccount(false);
                setEditAccount(null);
              }}
              onSubmit={(data) => {
                if (editAccount) {
                  handleEditAccount(data);
                } else {
                  handleAddAccount(data);
                }
              }}
              initialData={editAccount}
            />
          </div>
        </div>
        <Navbar />
      </div>
    </>
  );
};

export default Account;