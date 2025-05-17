import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Home = () => {
  // Khởi tạo state open từ localStorage
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });

  // Lưu lại mỗi khi open thay đổi
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  return (
    <div className="home-container">
      <Header />
      <div className="home-body">
        {/* Truyền open và setOpen vào Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* home-content sẽ có class thay đổi để margin-left phù hợp */}
        <div className={`home-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Đây là trang chủ</h1>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
