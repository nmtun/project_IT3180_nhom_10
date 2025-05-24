/* eslint-disable no-unused-vars */
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Resident.css';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import AddResident from '../components/AddResident';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosIntance from '../untils/axiosIntance';

const Resident = () => {
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [showAddResident, setShowAddResident] = React.useState(false);
  const [residents, setResidents] = React.useState([]);
  const [editResident, setEditResident] = React.useState(null);
  const [selectedResident, setSelectedResident] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [households, setHouseholds] = React.useState([]);
  const [roomNumbers, setRoomNumbers] = React.useState({});

  React.useEffect(() => {
    fetchResidents();
  }, []);

  // Lấy danh sách households khi load trang
  React.useEffect(() => {
    const fetchHouseholds = async () => {
      const res = await axiosIntance.get('/households/get-all-households');
      setHouseholds(res.data.households || res.data);
    };
    fetchHouseholds();
  }, []);

  // Tạo map HouseholdID -> RoomNumber
  React.useEffect(() => {
    const map = {};
    households.forEach(h => {
      map[String(h.HouseholdID)] = h.RoomNumber;
    });
    setRoomNumbers(map);
  }, [households]);

  const filteredResidents = residents.filter(item => {
    const room = roomNumbers[String(item.HouseholdID)] || '';
    return (
      item.FullName.toLowerCase().includes(search.toLowerCase()) ||
      item.PhoneNumber.toLowerCase().includes(search.toLowerCase()) ||
      room.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedResidents = [...filteredResidents].sort((a, b) => {
    const roomA = roomNumbers[String(a.HouseholdID)] || '';
    const roomB = roomNumbers[String(b.HouseholdID)] || '';
    // Nếu là số, so sánh số; nếu là chuỗi, so sánh chuỗi
    const numA = parseInt(roomA, 10);
    const numB = parseInt(roomB, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return roomA.localeCompare(roomB);
  });

  const fetchResidents = async () => {
    const response = await axiosIntance.get('/residents/get-all-residents');
    const data = response.data.residents || response.data;
    setResidents(data);
  };

  const handleAddResident = async (data) => {
    try {
      const response = await axiosIntance.post('/residents/create-resident', data);
      await fetchResidents();
      setShowAddResident(false);
    } catch (error) {
      alert('Thêm nhân khẩu thất bại!');
    }
  };

  const handleEditResident = async (data) => {
    try {
      const response = await axiosIntance.put(`/residents/update-resident/${editResident.ResidentID}`, data);
      
      const updatedResident = response.data.newResident || response.data;
        setResidents((prev) =>
          prev.map((h) => (h.ResidentID === updatedResident.ResidentID ? updatedResident : h))
        );
      await fetchResidents(); // Tùy ý: nếu bạn chắc response mới nhất thì có thể bỏ
      setEditResident(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật resident:", error?.response?.data || error);
      alert("Cập nhật nhân khẩu thất bại!");
    }
  };

  const handleDeleteResident = async (id) => {
    try {
      await axiosIntance.delete(`/residents/delete-resident/${id}`);
      setResidents((prev) => prev.filter((r) => r.ResidentID !== id));
      await fetchResidents();
      if (selectedResident?.ResidentID === id) {
        setSelectedResident(null); // Ẩn chi tiết nếu đang xem resident bị xóa
      }
    } catch (error) {
      alert('Xóa nhân khẩu thất bại!');
    }
  };

  return (
    <div className="resident-container">
      <Header />
      <div className="resident-body">
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`resident-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="resident-search">
            <div className="resident-title"><h1>Danh sách nhân khẩu:</h1></div>
            <SearchBar
              placeholder="Tìm kiếm nhân khẩu"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearch(searchInput);
                }
              }}
              onSearch={() => setSearch(searchInput)} // callback cho icon tìm kiếm
            />
          </div>
          <div className="resident-list">
            {sortedResidents.map((item, idx) => (
              <div
                className="resident-row"
                key={item.ResidentID || idx}
                onClick={() => setSelectedResident(item)}
                style={{ cursor: 'pointer' }}
              >
                <span><b>Phòng: </b>{roomNumbers[String(item.HouseholdID)] || '---'}</span>
                <span><b>Họ tên: </b>{item.FullName}</span>
                <span><b>Giới tính: </b>{item.Sex}</span>
                <span><b>Quan hệ với chủ hộ: </b>{item.Relationship}</span>
                <span><b>SĐT: </b>{item.PhoneNumber}</span>
                {/* <span><b>Mã hộ: </b>{item.HouseholdID}</span> */}
                <span className="resident-actions">
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResident(item);
                    }}
                  >
                    Details                 </button> */}
                  <FaEdit
                    className="icon-action edit"
                    title="Sửa"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditResident(item);
                    }}
                  />
                  <FaTrash
                    className="icon-action delete"
                    title="Xóa"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteResident(item.ResidentID);
                    }}
                  />
                </span>
              </div>
            ))}
          </div>

          {selectedResident && (
            <div className="resident-detail-overlay">
              <div className="resident-detail-modal">
                <h3>Thông tin chi tiết nhân khẩu</h3>
                <p><strong>Họ tên:</strong> {selectedResident.FullName}</p>
                <p><strong>Giới tính:</strong> {selectedResident.Sex}</p>
                <p><strong>Ngày sinh:</strong> {selectedResident.DateOfBirth}</p>
                <p><strong>Quan hệ với chủ hộ:</strong> {selectedResident.Relationship}</p>
                <p><strong>SĐT:</strong> {selectedResident.PhoneNumber}</p>
                <p><strong>Trình độ học vấn:</strong> {selectedResident.EducationLevel}</p>
                <p><strong>Nghề nghiệp:</strong> {selectedResident.Occupation}</p>
                <p>
                  <strong>Phòng:</strong> {roomNumbers[String(selectedResident.HouseholdID)] || '---'}
                </p>
                <p><strong>Tình trạng cư trú:</strong> {selectedResident.ResidencyStatus}</p>
                <p><strong>Ngày đăng ký:</strong> {selectedResident.RegistrationDate}</p>
                <button className="close-detail-btn" onClick={() => setSelectedResident(null)}>Đóng</button>
              </div>
            </div>
          )}

          <AddButton onClick={() => setShowAddResident(true)} />
          <AddResident
            open={showAddResident || !!editResident}
            onClose={() => {
              setShowAddResident(false);
              setEditResident(null);
            }}
            onSubmit={(data) => {
              if (editResident) {
                handleEditResident(data);
              } else {
                handleAddResident(data);
              }
            }}
            initialData={editResident}
          />
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Resident;
