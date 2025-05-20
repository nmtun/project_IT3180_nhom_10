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
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`home-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="dashboard">
            {/* Hàng trên - 3 khối nhỏ */}
            <div className="dashboard-top">
              <div className="card small-card">🏠 Tổng số hộ: <strong>15/30</strong></div>
              <div className="card small-card">💰 Phí dịch vụ: <strong>12/15 đã nộp</strong></div>
              <div className="card small-card">📊 Tạm trú/tạm vắng: <strong>5 / 3</strong></div>
            </div>

            {/* Hàng dưới - 2 khối biểu đồ lớn */}
            <div className="dashboard-bottom">
              <div className="card large-card">[Biểu đồ cột số hộ đã nộp phí]</div>
              <div className="card large-card">[Biểu đồ tròn cơ cấu nhân khẩu]</div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
