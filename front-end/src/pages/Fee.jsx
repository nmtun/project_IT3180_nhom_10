import React from 'react';
import '../styles/Fee.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axiosIntance from '../untils/axiosIntance';

const Fee = () => {
  // Khởi tạo state open từ localStorage
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  // Lưu lại mỗi khi open thay đổi
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);
  const [showAddFeeTypes, setShowAddFeeTypes] = React.useState(false);
  const [feeTypes, setFeeTypes] = React.useState([]);
  const [editFeeType, setEditFeeType] = React.useState(null);
  const [selectedFeetype, setSelectedFeetype] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');

  React.useEffect(() => {
    fetchFeeTypes();
  }, []);

  const filteredFeeTypes = feeTypes.filter(item =>
    item.FeeTypeName.toLowerCase().includes(search.toLowerCase()) ||
    item.Category.toLowerCase().includes(search.toLowerCase())
  );

  const fetchFeeTypes = async () => {
    const response = await axiosIntance.get('/fee-type/get-all-fee-type');
    const data = response.data.feeTypes || response.data;
    setFeeTypes(data);
  };

  const handleAddFeeType = async (data) => {
    try {
      const response = await axiosIntance.post('/fee-type/create-fee-type', data);
      await fetchFeeTypes();
      setShowAddFeeTypes(false);
    } catch (error) {
      alert('Thêm nhân khẩu thất bại!');
    }
  };

  const handleEditFeetype = async (data) => {
    try {
      const response = await axiosIntance.put(`/fee-type/update-fee-type/${editFeeType.FeeTypeID}`, data);
      const updatedFeeType = response.data.newFeeType || response.data;
        setFeeTypes((prev) =>
          prev.map((h) => (h.ResidentID === updatedFeeType.FeeTypeID ? updatedFeeType : h))
        );
      await fetchFeeTypes(); // Tùy ý: nếu bạn chắc response mới nhất thì có thể bỏ
      setEditFeeType(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật fee type:", error?.response?.data || error);
      alert("Cập nhật loại phí thất bại!");
    }
  };

  const handleDeleteFeeType = async (id) => {
    try {
      await axiosIntance.delete(`/fee-type/delete-fee-type/${id}`);
      setFeeTypes((prev) => prev.filter((r) => r.FeeTypeID !== id));
      await fetchFeeTypes();
      if (selectedFeetype?.FeeTypeID === id) {
        setSelectedFeetype(null); // Ẩn chi tiết nếu đang xem resident bị xóa
      }
    } catch (error) {
      alert('Xóa nhân khẩu thất bại!');
    }
  };

  return (
    <div className="fee-container">
      <Header />
      <div className="fee-body">
        {/* Truyền open và setOpen vào Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`fee-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="fee-search">
            <SearchBar
              placeholder="Tìm kiếm loại phí"
              search={search}
              setSearch={setSearch}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            <AddButton onClick={() => setShowAddFeeTypes(true)} />
          </div>
          {showAddFeeTypes && (
            <div className="fee-add-form">
              {/* Form thêm loại phí */}
              {/* ... */}
            </div>
          )}
          <div className="fee-list">
            {filteredFeeTypes.map((feeType) => (
              <div key={feeType.FeeTypeID} className="fee-item">
                <h3>{feeType.FeeTypeName}</h3>
                <p>{feeType.Description}</p>
                <p>Category: {feeType.Category}</p>
                <p>Unit Price: {feeType.UnitPrice}</p>
                <p>Unit: {feeType.Unit}</p>
                <div className="fee-actions">
                  <button onClick={() => {
                    setEditFeeType(feeType);
                    setShowAddFeeTypes(true);
                  }}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteFeeType(feeType.FeeTypeID)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Fee; 