import React, { useState, useEffect } from 'react';
import { FaHome, FaUsers, FaUserFriends, FaMoneyBill, FaCar, FaCog, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../styles/Sidebar.css";

const menuItems = [
  { icon: <FaHome />, label: "Trang chủ", path: "/home" },
  { icon: <FaUsers />, label: "Quản lý hộ gia đình", path: "/household" },
  { icon: <FaUserFriends />, label: "Quản lý nhân khẩu", path: "/resident" },
  { icon: <FaMoneyBill />, label: "Quản lý thu phí", path: "/fee" },
  { icon: <FaCar />, label: "Quản lý phương tiện", path: "/vehicle" },
  { icon: <FaCog />, label: "Cài đặt", path: "/settings" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      <div
        className="sidebar-toggle-item"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", fontWeight: "bold", width: "100%" }}
      >
        <FaBars />
        {open && <span className="sidebar-label">MENU</span>}
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer" }}
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