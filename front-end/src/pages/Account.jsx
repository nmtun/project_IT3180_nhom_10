import React from 'react';
import '../styles/Account.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';

const Account = () => {
  // Khởi tạo state open từ localStorage
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  // Lưu lại mỗi khi open thay đổi
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [search, setSearch] = React.useState('');

  return (
    <div className="account-container">
      <Header />x
      <div className="account-body">
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`account-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="account-title">
            <h1 className="account-title-text">Đanh sách tài khoản:</h1>
            <div className="account-search">
              <SearchBar 
                placeholder={"Tìm kiếm tài khoản..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="account-list">
            
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Account; 