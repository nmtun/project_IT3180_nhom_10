import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Resident.css';

const Resident = () => {
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
    <div className="resident-container">
      <Header />
      <div className="resident-body">
        {/* Truyền open và setOpen vào Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* home-content sẽ có class thay đổi để margin-left phù hợp */}
        <div className={`resident-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Đây là trang quản lý nhân khẩu</h1>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Resident;