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
  // Khởi tạo state open từ localStorage
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  // Lưu lại mỗi khi open thay đổi
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  // return (
  //   <div className="resident-container">
  //     <Header />
  //     <div className="resident-body">
  //       {/* Truyền open và setOpen vào Sidebar */}
  //       <Sidebar open={open} setOpen={setOpen} />

  //       {/* home-content sẽ có class thay đổi để margin-left phù hợp */}
  //       <div className={`resident-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
  //         <h1>Đây là trang quản lý nhân khẩu</h1>
  //       </div>
  //     </div>
  //     <Navbar />
  //   </div>
  // );
  const [showAddResident, setShowAddResident] = React.useState(false);
  const [residents, setResidents] = React.useState([]);
  const [editResident, setEditResident] = React.useState(null);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetchResidents();
  }, []);

  const filteredResidents = residents.filter(item =>
    item.FullName.toLowerCase().includes(search.toLowerCase()) ||
    item.PhoneNumber.toLowerCase().includes(search.toLowerCase())
  );

  const fetchResidents = async () => {
    const response = await axiosIntance.get('/residents/get-all-residents');
    const data = response.data.residents || response.data;
    setResidents(data);
  };

  const handleAddResident = async (data) => {
    try {
      const response = await axiosIntance.post('/residents/create-resident', {
        FullName: data.fullName,
        Sex: data.sex,
        Relationship: data.relationship,
        DateOfBirth: data.dateOfBirth,
        PhoneNumber: data.phoneNumber,
        HouseholdID: data.householdId,
        EducationLevel: data.educationLevel,
        Occupation: data.occupation,
        ResidencyStatus: data.residencyStatus,
        RegistrationDate: data.registrationDate,
      });
      const newResident = response.data.newResident || response.data;
      await fetchResidents();
      setShowAddResident(false);
    } catch (error) {
      alert('Thêm nhân khẩu thất bại!');
    }
  };

  const handleEditResident = async (data) => {
  try {
    const updatedFields = {};

    const map = {
      FullName: 'fullName',
      DateOfBirth: 'dateOfBirth',
      Sex: 'sex',
      Relationship: 'relationship',
      PhoneNumber: 'phoneNumber',
      HouseholdID: 'householdId',
      EducationLevel: 'educationLevel',
      Occupation: 'occupation',
      ResidencyStatus: 'residencyStatus',
      RegistrationDate: 'registrationDate'
    };

    for (const [key, formKey] of Object.entries(map)) {
      const newValue = data[formKey];
      const oldValue = editResident?.[key] ?? '';
      if (String(newValue) !== String(oldValue)) {
        updatedFields[key] = newValue;
      }
    }

    const response = await axiosIntance.put(
      `/residents/update-resident/${editResident.ResidentID}`,
      updatedFields
    );

    const updatedResident = response.data.resident || response.data;

    setResidents((prev) =>
      prev.map((r) =>
        r.ResidentID === updatedResident.ResidentID ? updatedResident : r
      )
    );
    await fetchResidents();
    setEditResident(null);
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error?.response?.data || error);
    alert('Cập nhật nhân khẩu thất bại!');
  }
};

  const handleDeleteResident = async (id) => {
    try {
      await axiosIntance.delete(`/residents/delete-resident/${id}`);
      setResidents((prev) => prev.filter((r) => r.ResidentID !== id));
      await fetchResidents();
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
            <SearchBar
              placeholder="Tìm kiếm nhân khẩu"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="resident-list">
            {filteredResidents.map((item, idx) => (
              <div className="resident-row" key={item.ResidentID || idx}>
                <span><b>Họ tên: </b>{item.FullName}</span>
                <span><b>Giới tính: </b>{item.Sex}</span>
                <span><b>Ngày sinh: </b>{item.DateOfBirth}</span>
                <span><b>Quan hệ với chủ hộ: </b>{item.Relationship}</span>
                <span><b>SĐT: </b>{item.PhoneNumber}</span>
                <span><b>Mã hộ: </b>{item.HouseholdID}</span>
                <span className="resident-actions">
                  <div>
                    <FaEdit
                    className="icon-action edit"
                    title="Sửa"
                    onClick={() => setEditResident(item)}
                    />
                    <FaTrash
                      className="icon-action delete"
                      title="Xóa"
                      onClick={() => handleDeleteResident(item.ResidentID)}
                    />
                  </div>
                </span>
              </div>
            ))}
          </div>
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