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
import Toast from '../components/Toast';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { validatePhoneNumber } from '../untils/helper';

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
  const [toast, setToast] = React.useState({ message: '', type: 'info' });
  const [deletingResident, setDeletingResident] = React.useState(null);

  React.useEffect(() => {
    fetchResidents();
  }, []);

  React.useEffect(() => {
    const fetchHouseholds = async () => {
      const res = await axiosIntance.get('/households/get-all-households');
      setHouseholds(res.data.households || res.data);
    };
    fetchHouseholds();
  }, []);

  React.useEffect(() => {
    const map = {};
    households.forEach(h => {
      map[String(h.HouseholdID)] = h.RoomNumber;
    });
    setRoomNumbers(map);
  }, [households]);

  const getResidentCount = (householdId) => {
    return residents.filter(r => r.HouseholdID === householdId).length;
  };

  const filteredResidents = residents.filter(item => {
    const room = roomNumbers[String(item.HouseholdID)] || '';
    const searchLower = search.toLowerCase();

    // Tách full name thành các phần, kiểm tra từng phần
    const nameParts = (item.FullName || '').toLowerCase().split(' ').filter(Boolean);
    const nameMatch = nameParts.some(part => part.includes(searchLower));

    return (
      nameMatch ||
      (item.PhoneNumber || '').toLowerCase().includes(searchLower) ||
      room.toLowerCase().includes(searchLower)
    );
  });

  const sortedResidents = [...filteredResidents].sort((a, b) => {
    const roomA = roomNumbers[String(a.HouseholdID)] || '';
    const roomB = roomNumbers[String(b.HouseholdID)] || '';
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
    const currentCount = getResidentCount(data.HouseholdID);
    const household = households.find(h => h.HouseholdID === data.HouseholdID);

    // Validate số điện thoại
    if (!validatePhoneNumber(data.PhoneNumber || '')) {
      setToast({ message: "Số điện thoại phải có 10 số và bắt đầu bằng số 0!", type: "error" });
      return;
    }

    if (household && currentCount >= household.Members) {
      setToast({ message: "Số nhân khẩu đã đạt tối đa cho phòng này!", type: "error" });
      return;
    }

    try {
      const response = await axiosIntance.post('/residents/create-resident', data);
      await fetchResidents();
      setShowAddResident(false);
      setToast({ message: "Thêm nhân khẩu thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Thêm nhân khẩu thất bại!", type: "error" });
    }
  };

  const handleEditResident = async (data) => {
    // Validate số điện thoại
    if (!validatePhoneNumber(data.PhoneNumber || '')) {
      setToast({ message: "Số điện thoại phải có 10 số và bắt đầu bằng số 0!", type: "error" });
      return;
    }

    try {
      const response = await axiosIntance.put(`/residents/update-resident/${editResident.ResidentID}`, data);
      const updatedResident = response.data.newResident || response.data;
      setResidents((prev) =>
        prev.map((h) => (h.ResidentID === updatedResident.ResidentID ? updatedResident : h))
      );
      await fetchResidents();
      setEditResident(null);
      setToast({ message: "Cập nhật nhân khẩu thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Cập nhật nhân khẩu thất bại!", type: "error" });
    }
  };

  const handleDeleteResident = async (id) => {
    try {
      await axiosIntance.delete(`/residents/delete-resident/${id}`);
      setResidents((prev) => prev.filter((r) => r.ResidentID !== id));
      await fetchResidents();
      setToast({ message: "Xóa nhân khẩu thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Xóa nhân khẩu thất bại!", type: "error" });
    }
  };

  const handleShowAddResident = (household) => {
    const currentCount = getResidentCount(household.HouseholdID);
    if (currentCount >= household.Members) {
      setToast({ message: "Số nhân khẩu đã đạt tối đa cho phòng này!", type: "error" });
      return;
    }
    setShowAddResident({
      householdId: household.HouseholdID,
      fullName: "",
      relationship: ""
    });
  };

  // Nhóm nhân khẩu theo HouseholdID
  const residentsByRoom = {};
  sortedResidents.forEach(resident => {
    const room = roomNumbers[String(resident.HouseholdID)] || '---';
    if (!residentsByRoom[room]) {
      residentsByRoom[room] = [];
    }
    residentsByRoom[room].push(resident);
  });

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
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
                onSearch={() => setSearch(searchInput)}
              />
            </div>
            <div className="resident-list">
              {Object.entries(residentsByRoom).map(([room, residentsInRoom]) => {
                // Sắp xếp: nhân khẩu chưa chuyển đi lên trước, đã chuyển đi xuống cuối
                const sortedInRoom = [...residentsInRoom].sort((a, b) => {
                  if (a.ResidencyStatus === "Đã chuyển đi" && b.ResidencyStatus !== "Đã chuyển đi") return 1;
                  if (a.ResidencyStatus !== "Đã chuyển đi" && b.ResidencyStatus === "Đã chuyển đi") return -1;
                  return 0;
                });
                return (
                  <React.Fragment key={room}>
                    <div className="resident-room-header">
                      <b>Phòng: {room}</b>
                    </div>
                    {sortedInRoom.map((item, idx) => (
                      <div
                        className={
                          "resident-row" +
                          (item.ResidencyStatus === "Đã chuyển đi" ? " resident-row-leaved" : "")
                        }
                        key={item.ResidentID || idx}
                        onClick={() => setSelectedResident(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <span><b>Họ tên: </b>{item.FullName}</span>
                        <span><b>Giới tính: </b>{item.Sex}</span>
                        <span><b>Quan hệ với chủ hộ: </b>{item.Relationship}</span>
                        <span><b>SĐT: </b>{item.PhoneNumber}</span>
                        <span className="resident-actions">
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
                              setDeletingResident(item);
                            }}
                          />
                        </span>
                      </div>
                    ))}
                  </React.Fragment>
                );
              })}
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
                  <p><strong>Phòng:</strong> {roomNumbers[String(selectedResident.HouseholdID)] || '---'}</p>
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

            <DeleteConfirmModal
              open={!!deletingResident}
              title="Xác nhận xóa"
              message={
                deletingResident
                  ? <>Bạn có chắc chắn muốn xóa nhân khẩu <strong>{deletingResident.FullName}</strong>?</>
                  : ""
              }
              onConfirm={async () => {
                await handleDeleteResident(deletingResident.ResidentID);
                setDeletingResident(null);
              }}
              onCancel={() => setDeletingResident(null)}
            />
          </div>
        </div>
        <Navbar />
      </div>
    </>
  );
};

export default Resident;
