import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosIntance from '../untils/axiosIntance';

import '../styles/Vehicle.css';
import AddButton from '../components/AddButton';

const Vehicle = () => {
  // State để lưu trữ danh sách xe
  const [vehicles, setVehicles] = useState([]);
  // State để lưu trạng thái loading
  const [loading, setLoading] = useState(false);
  // State để lưu thông báo lỗi
  const [error, setError] = useState(null);
  // State để lưu ID của xe đang được mở rộng
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  // State để lưu thông tin phòng
  const [roomNumbers, setRoomNumbers] = useState({});
  // State để lưu giá trị tìm kiếm
  const [searchId, setSearchId] = useState('');
  const [searchType, setSearchType] = useState('id'); // 'id' hoặc 'licensePlate'
  // State để lưu xe đang được chỉnh sửa
  const [editingVehicle, setEditingVehicle] = useState(null);
  // State để lưu form data
  const [formData, setFormData] = useState({
    HouseholdID: '',
    LicensePlate: '',
    VehicleType: '',
    Brand: '',
    Color: '',
    RegistrationDate: '',
    Status: ''
  });
  // State để xác định mode của form (edit/add)
  const [formMode, setFormMode] = useState('edit'); // 'edit' hoặc 'add'
  // State để lưu danh sách phòng
  const [rooms, setRooms] = useState([]);
  // State để lưu mapping giữa số phòng và HouseholdID
  const [roomToHouseholdMap, setRoomToHouseholdMap] = useState({});
  // State để lưu xe đang được chọn để xóa
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const vehicleImageLinks = [
    "https://image.luatvietnam.vn/uploaded/twebp/images/original/2024/02/16/boc-dau-xe-may-bi-phat-the-nao_1602162345.jpg", // Xe máy
    "https://s1storage.2banh.vn/image/2014/02/cach-boc-dau-xe-con-5824-1393314980-530c4ca4ddec6.jpg"
  ];

  const img1 = vehicleImageLinks[0];
  const img2 = vehicleImageLinks[1];

  // Khởi tạo state open từ localStorage
  const [open, setOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  // Lưu lại mỗi khi open thay đổi
  React.useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  // Hàm lấy thông tin phòng từ HouseholdID
  const fetchRoomNumber = async (householdId) => {
    try {
      const response = await axiosIntance.get(`/households/get-household-by-id/${householdId}`);
      console.log('Response household:', response.data);
      // Kiểm tra cấu trúc response và lấy RoomNumber
      if (response.data && response.data.household) {
        return response.data.household.RoomNumber;
      } else if (response.data && response.data.RoomNumber) {
        return response.data.RoomNumber;
      }
      return 'Không xác định';
    } catch (err) {
      console.error('Lỗi khi lấy thông tin phòng:', err);
      return 'Không xác định';
    }
  };

  // Hàm lấy danh sách tất cả xe
  const fetchAllVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosIntance.get('/vehicle/get-all-vehicle');
      console.log('Response vehicles:', response.data);

      if (response.data && response.data.vehicles && response.data.vehicles.length > 0) {
        setVehicles(response.data.vehicles);
        
        // Lấy thông tin phòng cho mỗi xe
        const roomNumbersData = {};
        for (const vehicle of response.data.vehicles) {
          if (vehicle.HouseholdID) {
            const roomNumber = await fetchRoomNumber(vehicle.HouseholdID);
            roomNumbersData[vehicle.HouseholdID] = roomNumber;
          }
        }
        setRoomNumbers(roomNumbersData);
      } else {
        setVehicles([]);
        console.log('Không có xe nào trong hệ thống');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách xe: ' + err.message);
      console.error('Lỗi khi tải danh sách xe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thông tin một xe theo ID
  // eslint-disable-next-line no-unused-vars
  const fetchVehicleById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:3000/api/vehicle/get-vehicle-by-id/${id}`);
      console.log('Thông tin xe:', response.data);
      return response.data;
    } catch (err) {
      setError('Lỗi khi tải thông tin xe: ' + err.message);
      console.error('Lỗi khi tải thông tin xe:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetch danh sách phòng
  const fetchRooms = async () => {
    try {
      const response = await axiosIntance.get('/households/get-all-households');
      if (response.data && response.data.households) {
        const roomsData = response.data.households.map(household => ({
          roomNumber: household.RoomNumber,
          householdId: household.HouseholdID
        }));
        setRooms(roomsData);
        
        // Tạo mapping giữa số phòng và HouseholdID
        const mapping = {};
        roomsData.forEach(room => {
          mapping[room.roomNumber] = room.householdId;
        });
        setRoomToHouseholdMap(mapping);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách phòng:', err);
      setError('Lỗi khi tải danh sách phòng: ' + err.message);
    }
  };

  // Gọi API lấy danh sách xe khi component được mount
  useEffect(() => {
    fetchAllVehicles();
  }, []);

  // Gọi API lấy danh sách phòng khi component được mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Hàm xử lý khi click vào box xe
  const handleVehicleClick = (vehicleId) => {
    setExpandedVehicleId(expandedVehicleId === vehicleId ? null : vehicleId);
  };

  // Hàm xử lý tìm kiếm xe
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      await fetchAllVehicles();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let response;
      
      if (searchType === 'id') {
        response = await axiosIntance.get(`/vehicle/get-vehicle-by-id/${searchId}`);
        if (response.data && response.data.vehicle) {
          setVehicles([response.data.vehicle]);
          if (response.data.vehicle.HouseholdID) {
            const roomNumber = await fetchRoomNumber(response.data.vehicle.HouseholdID);
            setRoomNumbers({ [response.data.vehicle.HouseholdID]: roomNumber });
          }
        } else {
          setVehicles([]);
          setError('Không tìm thấy xe với ID này');
        }
      } else {
        // Tìm kiếm theo biển số xe
        const allVehicles = await axiosIntance.get('/vehicle/get-all-vehicle');
        if (allVehicles.data && allVehicles.data.vehicles) {
          const filteredVehicles = allVehicles.data.vehicles.filter(
            vehicle => vehicle.LicensePlate.toLowerCase().replace(/-/g, '') === searchId.toLowerCase().replace(/-/g, '')
          );
          if (filteredVehicles.length > 0) {
            setVehicles(filteredVehicles);
            // Lấy thông tin phòng cho các xe được tìm thấy
            const roomNumbersData = {};
            for (const vehicle of filteredVehicles) {
              if (vehicle.HouseholdID) {
                const roomNumber = await fetchRoomNumber(vehicle.HouseholdID);
                roomNumbersData[vehicle.HouseholdID] = roomNumber;
              }
            }
            setRoomNumbers(roomNumbersData);
          } else {
            setVehicles([]);
            setError('Không tìm thấy xe với biển số này');
          }
        }
      }
    } catch (err) {
      setError('Lỗi khi tìm kiếm xe: ' + err.message);
      console.error('Lỗi khi tìm kiếm xe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi click vào nút edit
  const handleEditClick = (e, vehicle) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setEditingVehicle(vehicle);
    setFormData({
      HouseholdID: vehicle.HouseholdID,
      LicensePlate: vehicle.LicensePlate,
      VehicleType: vehicle.VehicleType,
      Brand: vehicle.Brand || '',
      Color: vehicle.Color || '',
      RegistrationDate: vehicle.RegistrationDate,
      Status: vehicle.Status
    });
  };

  // Hàm xử lý khi thay đổi giá trị trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'RoomNumber') {
      // Nếu đang chọn số phòng, lấy HouseholdID tương ứng
      setFormData(prev => ({
        ...prev,
        RoomNumber: value,
        HouseholdID: roomToHouseholdMap[value] || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Hàm xử lý khi click vào nút add
  const handleAddClick = () => {
    setFormMode('add');
    setEditingVehicle(null);
    setFormData({
      HouseholdID: '',
      RoomNumber: '',
      LicensePlate: '',
      VehicleType: 'Xe máy',
      Brand: '',
      Color: '',
      RegistrationDate: '',
      Status: 'Còn hạn đăng ký gửi'
    });
  };

  // Hàm xử lý khi submit form (cho cả add và edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (formMode === 'edit') {
        // Xử lý cập nhật xe
        const response = await axiosIntance.put(`/vehicle/update-vehicle/${editingVehicle.VehicleID}`, formData);
        if (response.data && response.data.vehicle) {
          setVehicles(prev => prev.map(vehicle => 
            vehicle.VehicleID === editingVehicle.VehicleID ? response.data.vehicle : vehicle
          ));
        }
      } else {
        // Xử lý thêm xe mới
        const response = await axiosIntance.post('/vehicle/create-vehicle', formData);
        if (response.data && response.data.vehicle) {
          setVehicles(prev => [...prev, response.data.vehicle]);
        }
      }
      
      // Đóng form sau khi thêm/sửa thành công
      setEditingVehicle(null);
      setFormMode('edit');
    } catch (err) {
      setError(formMode === 'edit' ? 
        'Lỗi khi cập nhật thông tin xe: ' + err.message :
        'Lỗi khi thêm xe mới: ' + err.message
      );
      console.error('Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi hủy form
  const handleCancel = () => {
    setEditingVehicle(null);
    setFormMode('edit');
    setFormData({
      HouseholdID: '',
      LicensePlate: '',
      VehicleType: '',
      Brand: '',
      Color: '',
      RegistrationDate: '',
      Status: ''
    });
  };

  // Hàm xử lý khi click vào nút xóa
  const handleDeleteClick = (e, vehicle) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setDeletingVehicle(vehicle);
  };

  // Hàm xử lý khi xác nhận xóa
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosIntance.delete(`/vehicle/delete-vehicle/${deletingVehicle.VehicleID}`);
      
      if (response.data && !response.data.error) {
        // Xóa xe khỏi danh sách
        setVehicles(prev => prev.filter(vehicle => vehicle.VehicleID !== deletingVehicle.VehicleID));
        setDeletingVehicle(null); // Đóng dialog xác nhận
      }
    } catch (err) {
      setError('Lỗi khi xóa xe: ' + err.message);
      console.error('Lỗi khi xóa xe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi hủy xóa
  const handleCancelDelete = () => {
    setDeletingVehicle(null);
  };

  return (
    <div className="vehicle-container">
      <Header />
      <div className="vehicle-body">
        {/* Truyền open và setOpen vào Sidebar */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* home-content sẽ có class thay đổi để margin-left phù hợp */}
        <div className={`vehicle-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="vehicle-header">
            <h1>Đây là trang quản lý phương tiện</h1>
          </div>
          
          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div className="vehicle-list">
            <div className="vehicle-list-header">
              <h2>Danh sách xe:</h2>
              <div className="header-actions">
                <form onSubmit={handleSearch} className="search-form">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-type-select"
                  >
                    <option value="id">Tìm theo ID</option>
                    <option value="licensePlate">Tìm theo biển số</option>
                  </select>
                  <input
                    type="text"
                    placeholder={searchType === 'id' ? "Nhập ID xe..." : "Nhập biển số xe..."}
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-button">
                    Tìm kiếm
                  </button>
                </form>
                <AddButton onClick={handleAddClick} />
              </div>
            </div>
            {vehicles.length > 0 ? (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => (
                  <div 
                    key={vehicle.VehicleID} 
                    className={`vehicle-box ${expandedVehicleId === vehicle.VehicleID ? 'expanded' : ''}`}
                    onClick={() => handleVehicleClick(vehicle.VehicleID)}
                  >
                    <div className="vehicle-basic-info">
                      <img 
                        src={vehicle.VehicleType === 'Xe máy' ? img1 : img2}
                        alt={vehicle.VehicleType}
                        className="vehicle-image"
                      />
                      <h3>Biển số: {vehicle.LicensePlate}</h3>
                      <p className={`status ${vehicle.Status === 'Còn hạn đăng ký gửi' ? 'active' : 'inactive'}`}>
                        {vehicle.Status}
                      </p>
                    </div>
                    
                    {expandedVehicleId === vehicle.VehicleID && (
                      <div className="vehicle-details">
                        <p><strong>ID:</strong> {vehicle.VehicleID}</p>
                        <p><strong>Loại xe:</strong> {vehicle.VehicleType}</p>
                        <p><strong>Nhãn hiệu:</strong> {vehicle.Brand}</p>
                        <p><strong>Màu sắc:</strong> {vehicle.Color}</p>
                        <p><strong>Ngày đăng ký:</strong> {vehicle.RegistrationDate}</p>
                        <p><strong>Phòng:</strong> {roomNumbers[vehicle.HouseholdID] || 'Đang tải...'}</p>
                        <div className="vehicle-actions">
                          <button 
                            className="edit-button"
                            onClick={(e) => handleEditClick(e, vehicle)}
                          >
                            Chỉnh sửa
                          </button>
                          <button 
                            className="delete-button"
                            onClick={(e) => handleDeleteClick(e, vehicle)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có xe nào</p>
            )}
          </div>

          {/* Form chỉnh sửa/thêm xe */}
          {(editingVehicle || formMode === 'add') && (
            <div className="edit-modal">
              <div className="edit-modal-content">
                <h2>{formMode === 'edit' ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}</h2>
                <form onSubmit={handleSubmit}>
                  {formMode === 'add' && (
                    <div className="form-group">
                      <label>Số phòng:</label>
                      <select
                        name="RoomNumber"
                        value={formData.RoomNumber}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn số phòng</option>
                        {rooms.map(room => (
                          <option key={room.householdId} value={room.roomNumber}>
                            Phòng {room.roomNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Biển số:</label>
                    <input
                      type="text"
                      name="LicensePlate"
                      value={formData.LicensePlate}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập biển số xe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại xe:</label>
                    <select
                      name="VehicleType"
                      value={formData.VehicleType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Xe máy">Xe máy</option>
                      <option value="Ô tô">Ô tô</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nhãn hiệu:</label>
                    <input
                      type="text"
                      name="Brand"
                      value={formData.Brand}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập nhãn hiệu xe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Màu sắc:</label>
                    <input
                      type="text"
                      name="Color"
                      value={formData.Color}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập màu sắc xe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày đăng ký:</label>
                    <input
                      type="date"
                      name="RegistrationDate"
                      value={formData.RegistrationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái:</label>
                    <select
                      name="Status"
                      value={formData.Status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Còn hạn đăng ký gửi">Còn hạn đăng ký gửi</option>
                      <option value="Hết hạn đăng ký gửi">Hết hạn đăng ký gửi</option>
                    </select>
                  </div>
                  <div className="form-buttons">
                    <button type="submit" className="submit-button">
                      {formMode === 'edit' ? 'Xác nhận' : 'Thêm xe'}
                    </button>
                    <button type="button" className="cancel-button" onClick={handleCancel}>
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Dialog xác nhận xóa */}
          {deletingVehicle && (
            <div className="delete-modal">
              <div className="delete-modal-content">
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa xe có biển số <strong>{deletingVehicle.LicensePlate}</strong>?</p>
                <div className="delete-modal-buttons">
                  <button 
                    className="confirm-delete-button"
                    onClick={handleConfirmDelete}
                  >
                    Xác nhận xóa
                  </button>
                  <button 
                    className="cancel-delete-button"
                    onClick={handleCancelDelete}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Vehicle;