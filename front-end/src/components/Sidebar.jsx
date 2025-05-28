import React from 'react';
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaMoneyBill,
  FaCar,
  FaBars,
  FaUser,
  FaAddressBook,
  FaMoneyCheck,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const menuItems = [
  { icon: <FaHome />, label: 'Trang chủ', path: '/home' },
  { icon: <FaUsers />, label: 'Quản lý hộ gia đình', path: '/household' },
  { icon: <FaUserFriends />, label: 'Quản lý nhân khẩu', path: '/resident' },
  { icon: <FaMoneyBill />, label: 'Quản lý thu phí', path: '/fee' },
  { icon: <FaCar />, label: 'Quản lý phương tiện', path: '/vehicle' },
  { icon: <FaAddressBook />, label: 'Trang cá nhân', path: '/profile' },
];


const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  // Tạo bản sao menuItems, thêm mục Account nếu là Tổ trưởng
  const sidebarMenu = [...menuItems];
  if (userRole === 'Tổ trưởng') {
    const settingsIndex = sidebarMenu.findIndex(item => item.label === 'Trang cá nhân');
    sidebarMenu.splice(settingsIndex, 0, {
      icon: <FaUser />,
      label: 'Quản lý người dùng',
      path: '/account',
    });
    // Thêm trang Quản lý loại phí
    sidebarMenu.splice(settingsIndex, 0, {
      icon: <FaMoneyCheck />,
      label: 'Quản lý các loại phí',
      path: '/fee-type',
    });
  }

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div
        className="sidebar-toggle-item"
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
      >
        <FaBars />
        {open && <span className="sidebar-label">MENU</span>}
      </div>
      <ul className="sidebar-menu">
        {sidebarMenu.map((item, idx) => (
          <li
            key={idx}
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
            title={!open ? item.label : undefined} 
          >
            {item.icon}
            {open && <span className="sidebar-label">{item.label}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
