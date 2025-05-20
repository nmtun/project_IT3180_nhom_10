import React from 'react';
import '../styles/Fee.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Fee = () => {
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
    <div className="fee-container">
      <Header />
      <div className="fee-body">
        {/* Truyền open và setOpen vào Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* home-content sẽ có class thay đổi để margin-left phù hợp */}
        <div className={`fee-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Đây là trang quản lý thu phí</h1>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Fee; 