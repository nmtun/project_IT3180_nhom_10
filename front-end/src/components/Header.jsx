import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Phần mềm quản lý chung cư BlueMoon</h1>
        <div className="logout-group">
          <FaSignOutAlt onClick={handleLogout} className="logout-icon" />
          <h4>Đăng xuất</h4>
        </div>  
      </div>
    </header>
  );
};

export default Header;
