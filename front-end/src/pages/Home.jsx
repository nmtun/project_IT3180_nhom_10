import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axiosInstance from '../untils/axiosIntance';

let MAX_HOUSEHOLD = 100;
let MAX_SINGLE_ROOMS = 50;
let MAX_DOUBLE_ROOMS = 50;

const dataBar = [
  { name: 'Đã nộp', value: 12 },
  { name: 'Chưa nộp', value: 3 },
];

const COLORS = ['#27ae60', '#e74c3c', '#ff9900', '#1972bb', '#8e44ad']; // 5 màu cho 5 nhóm tuổi

// Hàm tính tuổi từ ngày sinh
const getAge = (dob) => {
  if (!dob) return 0;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Hàm kiểm tra trong vòng 14 ngày
const isWithin14Days = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  return diffTime / (1000 * 60 * 60 * 24) <= 14;
};

const Home = () => {
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [households, setHouseholds] = useState([]);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    axiosInstance.get('/households/get-all-households').then(res => {
      setHouseholds(res.data.households || res.data);
    });
    axiosInstance.get('/residents/get-all-residents').then(res => {
      setResidents(res.data.residents || res.data);
    });
  }, []);

  const childrenCount = residents.filter(r => getAge(r.DateOfBirth || r.dateOfBirth) < 12).length;
  const teenCount = residents.filter(r => {
    const age = getAge(r.DateOfBirth || r.dateOfBirth);
    return age >= 12 && age <= 18;
  }).length;
  const adultCount = residents.filter(r => {
    const age = getAge(r.DateOfBirth || r.dateOfBirth);
    return age >= 19 && age <= 39;
  }).length;
  const middleAgeCount = residents.filter(r => {
    const age = getAge(r.DateOfBirth || r.dateOfBirth);
    return age >= 40 && age <= 65;
  }).length;
  const oldCount = residents.filter(r => getAge(r.DateOfBirth || r.dateOfBirth) > 65).length;

  const dataPie = [
    { name: 'Trẻ em', value: childrenCount },
    { name: 'Thanh niên', value: teenCount },
    { name: 'Trưởng thành', value: adultCount },
    { name: 'Trung niên', value: middleAgeCount },
    { name: 'Người già', value: oldCount },
  ];

  const totalHouseholds = households.length;
  const totalResidents = residents.length;

  const singleRooms = households.filter(h => h.Type === 'Đơn');
  const doubleRooms = households.filter(h => h.Type === 'Đôi');
  const availableSingleRooms = MAX_SINGLE_ROOMS - singleRooms.length;
  const availableDoubleRooms = MAX_DOUBLE_ROOMS - doubleRooms.length;

  const newComeCount = residents.filter(r => isWithin14Days(r.RegistrationDate)).length;
  const newLeaveCount = residents.filter(
    r => r.ResidencyStatus === "Đã chuyển đi" && isWithin14Days(r.RegistrationDate)
  ).length;

  const permanentCount = residents.filter(r => r.ResidencyStatus === "Thường trú").length;
  const temporaryCount = residents.filter(r => r.ResidencyStatus === "Tạm trú").length;

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
                <span className="card-title">🏠 Tổng số hộ: <strong>{totalHouseholds}/{MAX_HOUSEHOLD}</strong></span>
                <span className="card-title">🏠 Tổng số nhân khẩu: <strong>{totalResidents}</strong></span>
                <span className="card-title">🏠 Số phòng đơn còn: <strong>{availableSingleRooms}/{MAX_SINGLE_ROOMS}</strong></span>
                <span className="card-title">🏠 Số phòng đôi còn: <strong>{availableDoubleRooms}/{MAX_DOUBLE_ROOMS}</strong></span>
              </div>
              <div className="card small-card">
                <span className="card-title">Thống kê phí tháng 5:</span>
                <span className="card-title">💰 Số hộ đã nộp: <strong>12/15</strong></span>
                <span className="card-title">💰 Tổng phí thu: <strong>20 triệu VNĐ</strong></span>
                <span className="card-title">💰 Tỷ lệ hoàn thành: <strong>80%</strong></span>
              </div>
              <div className="card small-card">
                <span className="card-title">Trạng thái cư trú:</span>
                <span className="card-title">🏡 Thường trú: <strong>{permanentCount}</strong></span>
                <span className="card-title">🏡 Tạm trú: <strong>{temporaryCount}</strong></span>
                <span className="card-title">🏡 Mới chuyển đến: <strong>{newComeCount}</strong></span>
                <span className="card-title">🏡 Mới chuyển đi: <strong>{newLeaveCount}</strong></span>
              </div>
            </div>

            {/* Hàng dưới - 2 khối biểu đồ lớn */}
            <div className="dashboard-bottom">
              <div className="card large-card">
                <h3 style={{ marginBottom: 16 }}>Biểu đồ số hộ đã nộp phí</h3>
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
                <h3 style={{ marginBottom: 16 }}>Biểu đồ cơ cấu nhân khẩu</h3>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
