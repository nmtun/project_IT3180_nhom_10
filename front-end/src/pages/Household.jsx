/* eslint-disable no-unused-vars */
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Household.css';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import AddHousehold from '../components/AddHousehold';
import AddResident from '../components/AddResident'; 
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosIntance from '../untils/axiosIntance';
import Toast from '../components/Toast';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Household = () => {
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });

  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  React.useEffect(() => {
    fetchHouseholds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showAddHousehold, setShowAddHousehold] = React.useState(false);
  const [households, setHouseholds] = React.useState([]);
  const [editHousehold, setEditHousehold] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [showAddResident, setShowAddResident] = React.useState(false);
  const [newHouseholdId, setNewHouseholdId] = React.useState(null);
  const [selectedHousehold, setSelectedHousehold] = React.useState(null);
  const [residents, setResidents] = React.useState([]);
  const [toast, setToast] = React.useState({ message: '', type: 'info' });
  const [deletingHousehold, setDeletingHousehold] = React.useState(null);
  
  const filteredHouseholds = households.filter(item =>
    item.RoomNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.HouseholdHead.toLowerCase().includes(search.toLowerCase())
  );

  const fetchHouseholds = async () => {
    const response = await axiosIntance.get('/households/get-all-households');
    const data = response.data.households || response.data;
    setHouseholds(sortByRoomNumber(data));
  };

  const handleAddHousehold = async (data) => {
    try {
      const response = await axiosIntance.post('/households/create-household', {
        RoomNumber: data.roomNumber,
        Type: data.type,
        HouseholdHead: data.householdHead,
        Members: data.members,
        Notes: data.notes,
      });
      const newHousehold = response.data.newHousehold || response.data;
      await fetchHouseholds();
      setShowAddHousehold(false);

      setNewHouseholdId(newHousehold.HouseholdID);
      setShowAddResident({
        householdId: newHousehold.HouseholdID,
        fullName: newHousehold.HouseholdHead,
        relationship: "Chủ hộ"
      });

      setToast({ message: "Thêm hộ gia đình thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Thêm hộ gia đình thất bại!", type: "error" });
    }
  };

  const handleAddResident = async (residentData) => {
    try {
      await axiosIntance.post('/residents/create-resident', {
        ...residentData,
        householdId: newHouseholdId,
        relationship: "Chủ hộ",
      });
      setShowAddResident(false);
      setNewHouseholdId(null);
      setToast({ message: "Thêm nhân khẩu thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Thêm nhân khẩu thất bại!", type: "error" });
    }
  };

  const handleEditHousehold = async (data) => {
    try {
      const response = await axiosIntance.put(`/households/update-household/${editHousehold.HouseholdID}`, {
        RoomNumber: data.roomNumber,
        Type: data.type,
        HouseholdHead: data.householdHead,
        Members: data.members,
        Notes: data.notes,
      });
      const updatedHousehold = response.data.newHousehold || response.data;
      setHouseholds((prev) =>
        prev.map((h) => (h.HouseholdID === updatedHousehold.HouseholdID ? updatedHousehold : h))
      );
      await fetchHouseholds();
      setEditHousehold(null);
      setToast({ message: "Cập nhật hộ gia đình thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Cập nhật hộ gia đình thất bại!", type: "error" });
    }
  };

  const sortByRoomNumber = (arr) => {
    return [...arr].sort((a, b) => {
      // Nếu RoomNumber là số, so sánh số
      const numA = parseInt(a.RoomNumber, 10);
      const numB = parseInt(b.RoomNumber, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      // Nếu là chuỗi, so sánh chuỗi
      return a.RoomNumber.localeCompare(b.RoomNumber, 'vi', { numeric: true });
    });
  };

  const handleDeleteHousehold = async (id) => {
    try {
      await axiosIntance.delete(`/households/delete-household/${id}`);
      setHouseholds((prev) => prev.filter((h) => h.HouseholdID !== id));
      await fetchHouseholds();
      setToast({ message: "Xóa hộ gia đình thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Xóa hộ gia đình thất bại!", type: "error" });
    }
  }

  // Lấy danh sách nhân khẩu khi load trang
  React.useEffect(() => {
    const fetchResidents = async () => {
      const res = await axiosIntance.get('/residents/get-all-residents');
      setResidents(res.data.residents || res.data);
    };
    fetchResidents();
  }, []);

  return (
    <>
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast({ ...toast, message: '' })}
    />
    <div className="household-container">
      <Header />
      <div className="household-body">
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`household-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="household-search">
            <div className="household-title"><h1>Danh sách hộ gia đình:</h1></div>
            <SearchBar
              placeholder="Tìm kiếm hộ gia đình"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="household-list">
            <table className="household-table">
              <thead>
                <tr>
                  <th>Số phòng</th>
                  <th>Loại phòng</th>
                  <th>Chủ hộ</th>
                  <th>Số người</th>
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseholds.map((item, idx) => (
                  <tr
                    key={item.HouseholdID || idx}
                    onClick={() => setSelectedHousehold(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{item.RoomNumber}</td>
                    <td>{item.Type}</td>
                    <td>{item.HouseholdHead}</td>
                    <td>{item.Members}</td>
                    <td>{item.Notes || '-'}</td>
                    <td className="household-actions">
                      <FaEdit
                        className="icon-action edit"
                        title="Sửa"
                        onClick={e => { e.stopPropagation(); setEditHousehold(item); }}
                      />
                      <FaTrash
                        className="icon-action delete"
                        title="Xóa"
                        onClick={e => {
                          e.stopPropagation();
                          setDeletingHousehold(item);
                        }}
                      />
                    </td>
                  </tr>
                ))}
                {filteredHouseholds.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      Không có hộ gia đình nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal hiển thị thành viên hộ gia đình */}
          {selectedHousehold && (
            <div className="household-detail-overlay" onClick={() => setSelectedHousehold(null)}>
              <div className="household-detail-modal" onClick={e => e.stopPropagation()}>
                <h3>Thành viên phòng: {selectedHousehold.RoomNumber}</h3>
                <div className="household-detail-content">
                  {residents
                    .filter(r => String(r.HouseholdID) === String(selectedHousehold.HouseholdID))
                    .map(r => (
                      <div key={r.ResidentID} className="detail-row">
                        <p><strong>Họ tên:</strong> {r.FullName}</p>
                        <p><strong>Quan hệ:</strong> {r.Relationship}</p>
                      </div>
                    ))}
                </div>
                <button className="close-detail-btn" onClick={() => setSelectedHousehold(null)}>Đóng</button>
              </div>
            </div>
          )}
          <AddButton onClick={() => setShowAddHousehold(true)} />
          <AddHousehold
            open={showAddHousehold || !!editHousehold}
            onClose={() => {
              setShowAddHousehold(false);
              setEditHousehold(null);
            }}
            onSubmit={(data) => {
              if (editHousehold) {
                handleEditHousehold(data);
              } else {
                handleAddHousehold(data);
              }
            }}
            initialData={editHousehold}
          />
          {showAddResident && (
            <AddResident
              open={!!showAddResident}
              onClose={() => setShowAddResident(false)}
              onSubmit={handleAddResident}
              initialData={{
                householdId: showAddResident.householdId,
                fullName: showAddResident.fullName,
                relationship: "Chủ hộ"
              }}
            />
          )}
          <DeleteConfirmModal
            open={!!deletingHousehold}
            title="Xác nhận xóa"
            message={
              deletingHousehold
                ? <>Các dữ liệu liên quan đến hộ gia đình này sẽ bị xóa hết. Bạn có chắc chắn muốn xóa hộ gia đình phòng <strong>{deletingHousehold.RoomNumber}</strong>?</>
                : ""
            }
            onConfirm={async () => {
              await handleDeleteHousehold(deletingHousehold.HouseholdID);
              setDeletingHousehold(null);
            }}
            onCancel={() => setDeletingHousehold(null)}
          />
        </div>
      </div>
      <Navbar />
    </div>
    </>
  );
};

export default Household;
