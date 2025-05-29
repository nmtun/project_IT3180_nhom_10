/* eslint-disable no-unused-vars */
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Resident.css';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import AddResident from '../components/AddResident';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
  const [expandedRooms, setExpandedRooms] = React.useState({});

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

  const toggleRoom = (room) => {
    setExpandedRooms(prev => ({
      ...prev,
      [room]: !prev[room]
    }));
  };

  const filteredResidents = React.useMemo(() => {
    return residents.filter(item => {
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
  }, [residents, roomNumbers, search]);

  const sortedResidents = React.useMemo(() => {
    return [...filteredResidents].sort((a, b) => {
      const roomA = roomNumbers[String(a.HouseholdID)] || '';
      const roomB = roomNumbers[String(b.HouseholdID)] || '';
      const numA = parseInt(roomA, 10);
      const numB = parseInt(roomB, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return roomA.localeCompare(roomB);
    });
  }, [filteredResidents, roomNumbers]);

  // Nhóm nhân khẩu theo phòng và tìm chủ hộ
  const residentsByRoom = React.useMemo(() => {
    const result = {};
    sortedResidents.forEach(resident => {
      const room = roomNumbers[String(resident.HouseholdID)] || '---';
      if (!result[room]) {
        result[room] = {
          householdHead: null,
          members: []
        };
      }
      
      if (resident.Relationship === 'Chủ hộ') {
        result[room].householdHead = resident;
      }
      result[room].members.push(resident);
    });
    return result;
  }, [sortedResidents, roomNumbers]);

  // Tự động mở rộng phòng khi tìm kiếm
  React.useEffect(() => {
    if (search) {
      const searchLower = search.toLowerCase();
      const newExpandedRooms = {};
      
      Object.entries(residentsByRoom).forEach(([room, data]) => {
        // Kiểm tra nếu chủ hộ hoặc bất kỳ thành viên nào khớp với từ khóa tìm kiếm
        const householdHead = data.householdHead;
        const members = data.members;
        
        const isMatch = 
          (householdHead?.FullName || '').toLowerCase().includes(searchLower) ||
          (householdHead?.PhoneNumber || '').toLowerCase().includes(searchLower) ||
          members.some(member => 
            (member.FullName || '').toLowerCase().includes(searchLower) ||
            (member.PhoneNumber || '').toLowerCase().includes(searchLower)
          );
        
        if (isMatch) {
          newExpandedRooms[room] = true;
        }
      });
      
      setExpandedRooms(newExpandedRooms);
    } else {
      setExpandedRooms({});
    }
  }, [search, residentsByRoom]);

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
              <table className="resident-table">
                <thead>
                  <tr>
                    <th>Số phòng</th>
                    <th>Họ tên</th>
                    <th>Giới tính</th>
                    <th>Quan hệ với chủ hộ</th>
                    <th>Số điện thoại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(residentsByRoom).map(([room, data]) => {
                    const householdHead = data.householdHead;
                    const isExpanded = expandedRooms[room];
                    const searchLower = search.toLowerCase();
                    
                    // Kiểm tra xem phòng này có chứa kết quả tìm kiếm không
                    const hasSearchMatch = search && (
                      (householdHead?.FullName || '').toLowerCase().includes(searchLower) ||
                      (householdHead?.PhoneNumber || '').toLowerCase().includes(searchLower) ||
                      data.members.some(member => 
                        (member.FullName || '').toLowerCase().includes(searchLower) ||
                        (member.PhoneNumber || '').toLowerCase().includes(searchLower)
                      )
                    );
                    
                    // Nếu đang tìm kiếm và phòng này không có kết quả, bỏ qua
                    if (search && !hasSearchMatch) {
                      return null;
                    }

                    // Nếu đang tìm kiếm, hiển thị tất cả thành viên
                    const shouldShowMembers = search || isExpanded;
                    
                    // Kiểm tra xem có cần hiển thị dòng chủ hộ không
                    const shouldShowHouseholdHead = !search || (householdHead && (
                      householdHead.FullName.toLowerCase().includes(searchLower) ||
                      householdHead.PhoneNumber?.toLowerCase().includes(searchLower)
                    ));
                    
                    return (
                      <React.Fragment key={room}>
                        {/* Hiển thị chủ hộ */}
                        {shouldShowHouseholdHead && (
                          <tr
                            className={`household-head-row ${hasSearchMatch ? 'search-match' : ''}`}
                            onClick={() => {
                              if (householdHead) {
                                setSelectedResident(householdHead);
                              } else if (!search && data.members.length > 1) {
                                toggleRoom(room);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>
                              {!search && data.members.length > 1 ? (
                                <div className="room-cell" onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRoom(room);
                                }}>
                                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                  <span>{room}</span>
                                </div>
                              ) : (
                                <div className="room-cell">
                                  <span style={{ visibility: 'hidden' }}><FaChevronDown /></span>
                                  <span>{room}</span>
                                </div>
                              )}
                            </td>
                            <td>{householdHead?.FullName || 'Chưa có chủ hộ'}</td>
                            <td>{householdHead?.Sex || '-'}</td>
                            <td>Chủ hộ</td>
                            <td>{householdHead?.PhoneNumber || '-'}</td>
                            <td className="resident-actions">
                              {householdHead && (
                                <>
                                  <FaEdit
                                    className="icon-action edit"
                                    title="Sửa"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditResident(householdHead);
                                    }}
                                  />
                                  <FaTrash
                                    className="icon-action delete"
                                    title="Xóa"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingResident(householdHead);
                                    }}
                                  />
                                </>
                              )}
                            </td>
                          </tr>
                        )}
                        {/* Hiển thị các thành viên khác */}
                        {shouldShowMembers && data.members
                          .filter(member => member.ResidentID !== householdHead?.ResidentID)
                          .map((member, idx) => {
                            // Kiểm tra xem thành viên này có khớp với từ khóa tìm kiếm không
                            const isMemberMatch = search && (
                              (member.FullName || '').toLowerCase().includes(searchLower) ||
                              (member.PhoneNumber || '').toLowerCase().includes(searchLower)
                            );
                            
                            // Nếu đang tìm kiếm và thành viên này không khớp, bỏ qua
                            if (search && !isMemberMatch) {
                              return null;
                            }
                            
                            return (
                              <tr
                                key={member.ResidentID || idx}
                                className={`${member.ResidencyStatus === "Đã chuyển đi" ? "resident-row-leaved" : ""} ${isMemberMatch ? 'search-match' : ''}`}
                                onClick={() => setSelectedResident(member)}
                                style={{ cursor: 'pointer' }}
                              >
                                <td>
                                  <div className="room-cell">
                                    <span style={{ visibility: 'hidden' }}><FaChevronDown /></span>
                                    <span>{room}</span>
                                  </div>
                                </td>
                                <td>{member.FullName}</td>
                                <td>{member.Sex}</td>
                                <td>{member.Relationship}</td>
                                <td>{member.PhoneNumber || '-'}</td>
                                <td className="resident-actions">
                                  <FaEdit
                                    className="icon-action edit"
                                    title="Sửa"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditResident(member);
                                    }}
                                  />
                                  <FaTrash
                                    className="icon-action delete"
                                    title="Xóa"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingResident(member);
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedResident && (
              <div className="resident-detail-overlay" onClick={() => setSelectedResident(null)}>
                <div className="resident-detail-modal" onClick={e => e.stopPropagation()}>
                  <h3>Thông tin chi tiết nhân khẩu</h3>
                  <div className="resident-detail-content">
                    <div className="detail-row">
                      <p><strong>Họ tên:</strong> {selectedResident.FullName}</p>
                      <p><strong>Giới tính:</strong> {selectedResident.Sex}</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Ngày sinh:</strong> {selectedResident.DateOfBirth}</p>
                      <p><strong>Quan hệ với chủ hộ:</strong> {selectedResident.Relationship}</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Số điện thoại:</strong> {selectedResident.PhoneNumber || '-'}</p>
                      <p><strong>Trình độ học vấn:</strong> {selectedResident.EducationLevel || '-'}</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Nghề nghiệp:</strong> {selectedResident.Occupation || '-'}</p>
                      <p><strong>Phòng:</strong> {roomNumbers[String(selectedResident.HouseholdID)] || '---'}</p>
                    </div>
                    <div className="detail-row">
                      <p><strong>Tình trạng cư trú:</strong> {selectedResident.ResidencyStatus}</p>
                      <p><strong>Ngày đăng ký:</strong> {selectedResident.RegistrationDate}</p>
                    </div>
                  </div>
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
