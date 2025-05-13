import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Trang Chủ</h1>
      <p>Chào mừng bạn đã đăng nhập thành công!</p>
      <button onClick={handleLogout} className="logout-button">
        Đăng Xuất
      </button>
    </div>
  );
};

export default Home; 