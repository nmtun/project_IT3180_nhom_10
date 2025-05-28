/* eslint-disable no-unused-vars */
import React from 'react';
import '../styles/Fee.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import AddButton from '../components/AddButton';
import AddFeeCollection from '../components/AddFeeCollection';
import axiosIntance from '../untils/axiosIntance';
import FeeCollectionList from '../components/FeeCollectionList';
import FeeDetailTable from '../components/FeeDetailTable';
import Toast from '../components/Toast';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import FeeDetailSpecial from '../components/FeeDetailSpecial';

const safeArray = (input) => Array.isArray(input) ? input : [];

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
  
  const [showAddFeeCollection, setShowAddFeeCollection] = React.useState(false);
  const [feeCollection, setFeeCollection] = React.useState([]);
  const [editFeeCollection, setEditFeeCollection] = React.useState(null);
  const [selectedFeeCollection, setSelectedFeeCollection] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [feeDetails, setFeeDetails] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [toast, setToast] = React.useState({ message: '', type: 'info' });
  const [deletingFeeCollection, setDeletingFeeCollection] = React.useState(null);  
  const [selectedFeeType, setSelectedFeeType] = React.useState(null);
  

  React.useEffect(() => {
    fetchFeeCollection();
  }, []);

 const fetchFeeDetailsByCollectionId = async (collectionId) => {
    console.log("Fetching details for collection ID:", collectionId);
    try {
      const res = await axiosIntance.get(`/fee-detail/get-all-fee-detail?feeCollectionId=${collectionId}`);
      console.log("API response:", res.data);
      const data = res.data.feeDetails || res.data; // tùy API trả về
      console.log("Processed data:", data);
      setFeeDetails(data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phí:", error);
      setFeeDetails([]);
    }
  };
    const handleStatusChange = async (detailId, isPaid, paymentMethod) => {
      try {
        // Lấy bản ghi hiện tại
        const detail = feeDetails.find(d => d.FeeDetailID === detailId);
        // Lấy unit price nếu là phí chung
        const isChung = selectedFeeCollection?.FeeType?.Scope === "Chung";
        const amount = isChung
          ? selectedFeeCollection?.FeeType?.UnitPrice
          : detail?.Amount;

        await axiosIntance.put(
          `/fee-detail/update-fee-detail/${detailId}`,
          {
            Amount: amount, // <-- cập nhật amount đúng cho phí chung
            AmountPaid: isPaid ? amount : 0,
            PaymentStatus: isPaid ? 'Đã đóng' : 'Chưa đóng',
            PaymentDate: isPaid ? new Date().toISOString().split('T')[0] : null,
            PaymentMethod: paymentMethod || detail?.PaymentMethod || "Tiền mặt"
          }
        );
        fetchFeeDetailsByCollectionId(selectedFeeCollection.CollectionID);
      } catch (err) {
        console.error('Cập nhật thanh toán lỗi:', err);
      }
    };

  const handleFetchStats = async () => {
    try {
      const res = await axiosIntance.get(
        `/fee-detail/stats/${selectedFeeCollection.CollectionID}`
      );
      setStats(res.data);
    } catch (err) {
      console.error('Lấy thống kê lỗi:', err);
    }
  };

  const filteredFeeCollection = feeCollection.filter(item =>
    item.CollectionName.toLowerCase().includes(search.toLowerCase()) ||
    item.Status.toLowerCase().includes(search.toLowerCase())
  );

  const fetchFeeCollection= async () => {
    try {
    const res = await axiosIntance.get('/fee-collection/get-all-collection');
    const data = res.data.feeCollections || res.data;

    setFeeCollection(safeArray(data)); // tránh mọi lỗi
  } catch (err) {
    console.error('Lỗi khi gọi API:', err);
    setFeeCollection([]);
  }
  };

  const handleVehicleFeeDetailUpdate = async (collectionId) => {
    try {
      await axiosIntance.put(`/fee-detail/update-vehicle-fee/${collectionId}`);
      setToast({ message: "Cập nhật phí gửi xe thành công!", type: "success" });
    } catch (error) {
      console.error("Lỗi khi cập nhật phí gửi xe:", error);
      setToast({ message: "Cập nhật phí gửi xe thất bại!", type: "error" });
    }
  };

  const handleAddFeeCollection = async (data) => {
    try {
      const response = await axiosIntance.post(`/fee-collection/create-collection`, data);
      const collectionId = response.data.feeCollection?.CollectionID;
      const sc = response.data.feeCollection?.FeeType?.Scope;
      const ct = response.data.feeCollection?.FeeType?.Category;
      const ftn = response.data.feeCollection?.FeeType?.FeeTypeName;

      // Lấy danh sách hộ gia đình và amount mặc định
      const householdRes = await axiosIntance.get(`/households/get-all-households`);
      const households = householdRes.data.households || [];
      const defaultAmount = response.data.feeCollection?.FeeType?.UnitPrice;

      // Chỉ tạo FeeDetail tự động nếu scope là "Chung"
      if (sc === 'Chung') {
        const createFeeDetailPromises = households.map(hh =>
          axiosIntance.post(`/fee-detail/create-fee-detail`, {
            CollectionID: collectionId,
            HouseholdID: hh.HouseholdID,
            Amount: defaultAmount,
            PaymentStatus: "Chưa đóng",
            PaymentDate: null,
            PaymentMethod: "Tiền mặt",
          })
        );
        await Promise.all(createFeeDetailPromises);
      } else if (ftn === 'Phí gửi xe') {
          const createFeeDetailPromises = households.map(hh =>
          axiosIntance.post(`/fee-detail/create-fee-detail`, {
            CollectionID: collectionId,
            HouseholdID: hh.HouseholdID,
            Amount: 0, 
            PaymentStatus: "Chưa đóng",
            PaymentDate: null,
            PaymentMethod: "Tiền mặt",
          })
        );
        await Promise.all(createFeeDetailPromises);
        handleVehicleFeeDetailUpdate(collectionId);
      }  
      //console.log("FeeType Scope:", response.data.feeCollection?.FeeType?.Scope);
      
      await fetchFeeCollection();
      setShowAddFeeCollection(false);
      setToast({ message: "Thêm đợt thu phí thành công!", type: "success" });
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      setToast({ message: "Thêm đợt thu phí thất bại!", type: "error" });
    }
  };

  const handleEditFeeCollection = async (data) => {
    try {
      const response = await axiosIntance.put(`/fee-collection/update-collection/${editFeeCollection.CollectionID}`, data);
      
      const updatedFeeCollection = response.data.newFeeCollection || response.data;
        setFeeCollection((prev) =>
          prev.map((h) => (h.CollectionID === updatedFeeCollection.FeeCollectionID ? updatedFeeCollection : h))
        );
      await fetchFeeCollection(); // Tùy ý: nếu bạn chắc response mới nhất thì có thể bỏ
      setEditFeeCollection(null);
      setToast({ message: "Cập nhật đợt thu phí thành công!", type: "success" });
    } catch (error) {
      console.error("Lỗi khi cập nhật FeeCollection:", error?.response?.data || error);
      setToast({ message: "Cập nhật đợt thu phí thất bại!", type: "error" });
    }
  };

  const handleDeleteFeeCollection = async (id) => {
    try {
      await axiosIntance.delete(`/fee-collection/delete-collection/${id}`);
      setFeeCollection((prev) => prev.filter((r) => r.CollectionID !== id));
      await fetchFeeCollection();
      if (selectedFeeCollection?.CollectionID === id) {
        setSelectedFeeCollection(null); 
      }
      setToast({ message: "Xóa đợt thu phí thành công!", type: "success" });
    } catch (error) {
      setToast({ message: "Xóa đợt thu phí thất bại!", type: "error" });
    }
  };

  const handleSelectedFeeCollection = (collection) => {
    setSelectedFeeCollection(collection);
    setStats(null);
    fetchFeeDetailsByCollectionId(collection.CollectionID);
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
      <div className="fee-container">
        <Header />
        <div className="fee-body">
          <Sidebar open={open} setOpen={setOpen} />
          <div className={`fee-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="fee-search">
              <div className="fee-title">
                <h1>Danh sách các đợt thu phí:</h1>
              </div> 
              <SearchBar
                placeholder="Tìm kiếm đợt thu phí"
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
            <FeeCollectionList
              feeCollections={filteredFeeCollection}
              onEdit={setEditFeeCollection}
              onDeleteRequest={setDeletingFeeCollection}
              onSelect={handleSelectedFeeCollection}
            />

            {selectedFeeCollection && (
              <>
                {/* 1️⃣ Overlay bao quanh cả FeeDetail modal */}
                <div className="modal-overlay" onClick={() => setSelectedFeeCollection(null)} />

                {/* 2️⃣ Modal chính FeeDetail */}
                <div className="modal-content fee-detail-modal">
                  <div className="fee-detail-header">
                    <h3 className="fee-detail-title">
                      Thông tin đợt thu {selectedFeeCollection.CollectionName}
                    </h3>
                    <div className="fee-detail-meta">
                      <p><strong>Loại phí:</strong> {selectedFeeCollection?.FeeType?.FeeTypeName}</p>
                      <p><strong>Phạm vi:</strong> {selectedFeeCollection?.FeeType?.Scope}</p>
                      <p><strong>Hình thức:</strong> {selectedFeeCollection?.FeeType?.Category}</p>
                      <p><strong>Thời gian bắt đầu:</strong> {selectedFeeCollection?.StartDate ? new Date(selectedFeeCollection.StartDate).toLocaleDateString() : '—'}</p>
                      <p><strong>Thời gian kết thúc:</strong> {selectedFeeCollection?.EndDate ? new Date(selectedFeeCollection.EndDate).toLocaleDateString() : '—'}</p>
                      <p><strong>Trạng thái:</strong> {selectedFeeCollection?.Status}</p>
                    </div>
                  </div>
                  <button className="btn-stats" onClick={handleFetchStats}>
                    Xem Thống kê
                  </button> 

                  {stats && (
                    <div className="modal-content stats-modal">
                      <h4>Thống kê đợt thu</h4>
                      <p><strong>Tổng hộ:</strong> {stats.totalHouseholds}</p>
                      <p><strong>Đã đóng:</strong> {stats.paidCount}</p>
                      <p><strong>Chưa đóng:</strong> {stats.unpaidCount}</p>
                      <p><strong>Đã thu:</strong> {stats.totalCollected.toLocaleString()} VNĐ</p>
                      <p><strong>Chưa thu:</strong> {stats.totalRemaining.toLocaleString()} VNĐ</p>
                      <button onClick={() => setStats(null)}>Đóng</button>
                    </div>
                  )}
                  {/* <FeeDetailTable details={feeDetails} onStatusChange={handleStatusChange} /> */}

                  {(((selectedFeeCollection?.FeeType?.Category === 'Bắt buộc' &&
                  selectedFeeCollection?.FeeType?.Scope === 'Riêng') ||
                  (selectedFeeCollection?.FeeType?.Category === 'Tự nguyện' &&
                  selectedFeeCollection?.FeeType?.Scope === 'Riêng')) && 
                  selectedFeeCollection?.FeeType?.FeeTypeName !== 'Phí gửi xe' ) ? (
                    <FeeDetailSpecial
                      CollectionID = {selectedFeeCollection.CollectionID}
                      FeeTypeName={selectedFeeCollection?.FeeType?.FeeTypeName}
                    />
                  ) : (
                    <FeeDetailTable 
                      details={feeDetails} 
                      onStatusChange={handleStatusChange} 
                      feeType={selectedFeeCollection?.FeeType}
                    />
                  )}
                  <button className="btn-close" onClick={() => setSelectedFeeCollection(null)}>x</button>
                </div>
              </>
            )}
            <AddButton onClick={() => setShowAddFeeCollection(true)} />
            <AddFeeCollection
              open={showAddFeeCollection || !!editFeeCollection}
              onClose={() => {
                setShowAddFeeCollection(false);
                setEditFeeCollection(null);
              }}
              onSubmit={(data) => {
                if (editFeeCollection) {
                  handleEditFeeCollection(data);
                } else {
                  handleAddFeeCollection(data);
                }
              }}
              initialData={editFeeCollection}
            />
            <DeleteConfirmModal
              open={!!deletingFeeCollection}
              title="Xác nhận xóa"
              message={
                deletingFeeCollection
                  ? <> Dữ liệu thu phí của các hộ gia đình của đợu thu phí này cũng sẽ bị xóa, bạn có chắc chắn muốn xóa đợt thu phí<strong>{deletingFeeCollection.CollectionName}</strong>?</>
                  : ""
              }
              onConfirm={async () => {
                await handleDeleteFeeCollection(deletingFeeCollection.CollectionID);
                setDeletingFeeCollection(null);
              }}
              onCancel={() => setDeletingFeeCollection(null)}
            />

          </div>
        </div>
        <Navbar/>
      </div>
    </>
  );
};

export default Fee;