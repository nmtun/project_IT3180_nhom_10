import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const dataBar = [
  { name: 'Đã nộp', value: 12 },
  { name: 'Chưa nộp', value: 3 },
];

const dataPie = [
  { name: 'Nam', value: 30 },
  { name: 'Nữ', value: 20 },
];

const COLORS = ['#1972bb', '#e74c3c'];

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
              <div className="card small-card">
                <span className="card-title">🏠 Tổng số hộ: <strong>15/30</strong></span>
                <span className="card-title">🏠 Tổng số nhân khẩu: <strong>50</strong></span>
                <span className="card-title">🏠 Số phòng đơn còn: <strong>10</strong></span>
                <span className="card-title">🏠 Số phòng đôi còn: <strong>5</strong></span>                
              </div>
              <div className="card small-card">
                <span className="card-title">Thống kê phí tháng 5:</span>
                <span className="card-title">💰 Số hộ đã nộp: <strong>12/15</strong></span>
                <span className="card-title">💰 Tổng phí thu: <strong>20 triệu VNĐ</strong></span>
                <span className="card-title">💰 Tỷ lệ hoàn thành: <strong>80%</strong></span>
              </div>
              <div className="card small-card">
                <span className="card-title">Trạng thái cư trú:</span>
                <span className="card-title">🏡 Thường trú: <strong>40</strong></span>
                <span className="card-title">🏡 Tạm trú: <strong>10</strong></span>
                <span className="card-title">🏡 Mói chuyển đến: <strong>5</strong></span>
                <span className="card-title">🏡 Mới chueyenr đi: <strong>2</strong></span>
              </div>
            </div>
            {/* Hàng dưới - 2 khối biểu đồ lớn */}
            <div className="dashboard-bottom">
              <div className="card large-card">
                <h3 style={{marginBottom: 16}}>Biểu đồ số hộ đã nộp phí</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={dataBar}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1972bb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card large-card">
                <h3 style={{marginBottom: 16}}>Biểu đồ cơ cấu nhân khẩu</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={dataPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
