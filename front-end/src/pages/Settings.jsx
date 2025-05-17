import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Settings.css';

const Settings = () => {
  // Khởi tạo state open từ localStorage
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  // Lưu lại mỗi khi open thay đổi
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  return (
    <div className="settings-container">
      <Header />
      <div className="settings-body">
        {/* Truyền open và setOpen vào Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* home-content sẽ có class thay đổi để margin-left phù hợp */}
        <div className={`settings-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Đây là trang cài đặt</h1>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Settings;