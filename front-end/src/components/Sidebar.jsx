import React, { useState } from 'react';
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`sidebar ${open ? 'open' : ''}`}>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        {open ? '<' : '>'}
      </button>
      <ul className="sidebar-menu">
        <li>Trang chủ</li>
        <li>Quản lý hộ gia đình</li>
        <li>Quản lý nhân khẩu</li>
        <li>Quản lý thu phí</li>
        <li>Quản lý phương tiện</li>
        <li>Cài đặt</li>
      </ul>
    </div>
  );
};

export default Sidebar;