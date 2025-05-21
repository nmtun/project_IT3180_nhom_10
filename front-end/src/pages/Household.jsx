import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Household.css';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import AddHousehold from '../components/AddHousehold';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosIntance from '../untils/axiosIntance';

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
  }, []);

  const [showAddHousehold, setShowAddHousehold] = React.useState(false);
  const [households, setHouseholds] = React.useState([]);
  const [editHousehold, setEditHousehold] = React.useState(null);
  const [search, setSearch] = React.useState('');

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
      //setHouseholds((prev) => [...prev, newHousehold]);
      await fetchHouseholds();
      setShowAddHousehold(false);
    } catch (error) {
      alert('Thêm hộ gia đình thất bại!');
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
    } catch (error) {
      alert('Cập nhật hộ gia đình thất bại!');
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
    } catch (error) {
      alert('Xóa hộ gia đình thất bại!');
    }
  }

  return (
    <div className="household-container">
      <Header />
      <div className="household-body">
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`household-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="household-search">
            <div className="household-title"><h1>Danh sách hộ gia đình: </h1></div>
            <div className="search-bar">
              <SearchBar
                placeholder="Tìm kiếm hộ gia đình"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="household-list">
            {filteredHouseholds.map((item, idx) => (
              <div className="household-row" key={item.HouseholdID || idx}>
                <span><b>Số phòng: </b>{item.RoomNumber}</span>
                <span><b>Loại phòng: </b>{item.Type}</span>
                <span><b>Chủ hộ: </b>{item.HouseholdHead}</span>
                <span><b>Số người: </b>{item.Members}</span>
                <span><b>Ghi chú: </b>{item.Notes}</span>
                <span className="household-actions">
                  <FaEdit
                    className="icon-action edit"
                    title="Sửa"
                    onClick={() => setEditHousehold(item)}
                  />
                  <FaTrash
                    className="icon-action delete"
                    title="Xóa"
                    onClick={() => handleDeleteHousehold(item.HouseholdID)}
                  />
                </span>
              </div>
            ))}
          </div>
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
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Household;
