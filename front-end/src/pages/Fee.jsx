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
import { FaWindowClose } from "react-icons/fa";


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
    const handleStatusChange = async (detailId, isPaid) => {
    try {
       // payload theo API backend của bạn
      await axiosIntance.put(
        `/fee-detail/update-fee-detail/${detailId}`,
        {
          AmountPaid:    isPaid
                          ? feeDetails.find(d => d.FeeDetailID === detailId).AmountDue
                          : 0,
          PaymentStatus: isPaid ? 'Đã đóng' : 'Chưa đóng',
          PaymentDate:   isPaid ? new Date().toISOString().split('T')[0] : null
        }
      );
      // reload lại details
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

  const handleAddFeeCollection = async (data) => {
  try {
    const response = await axiosIntance.post(`/fee-collection/create-collection`, data);
    const collectionId = response.data.feeCollection?.CollectionID;
    console.log("🎯 Final collection ID:", collectionId);

    const householdRes = await axiosIntance.get(`/households/get-all-households`);
    const households = householdRes.data.households || [];
    const defaultAmountDue = response.data.feeCollection?.TotalAmount / households.length;

    const createFeeDetailPromises = households.map(hh =>
      axiosIntance.post(`/fee-detail/create-fee-detail`, {
        CollectionID: collectionId,
        HouseholdID: hh.HouseholdID,
        AmountDue: defaultAmountDue,
        AmountPaid: 0,
        PaymentStatus: "Chưa đóng",
        PaymentDate: null,
        PaymentMethod: "Tiền mặt",
      })
    );

    await Promise.all(createFeeDetailPromises);
    
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
    console.log("Selected collection:", collection);
    console.log("Collection ID:", collection.CollectionID);
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
                  <h3>Chi tiết phí: {selectedFeeCollection.CollectionName}</h3>
                  <button className="btn-stats" onClick={handleFetchStats}>
                    Xem Thống kê
                  </button>

                  {stats && (
                    <div className="modal-content stats-modal">
                      <h4>Thống kê đợt thu</h4>
                      <p><strong>Tổng hộ:</strong> {stats.totalHouseholds}</p>
                      <p><strong>Đã đóng:</strong> {stats.paidCount}</p>
                      <p><strong>Chưa đóng:</strong> {stats.unpaidCount}</p>
                      <p><strong>Tổng thu:</strong> {stats.totalCollected.toLocaleString()} VNĐ</p>
                      <p><strong>Còn thiếu:</strong> {stats.totalRemaining.toLocaleString()} VNĐ</p>
                      <button onClick={() => setStats(null)}>Đóng</button>
                    </div>
                  )}

                  <FeeDetailTable details={feeDetails} onStatusChange={handleStatusChange} />
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
                  ? <>Bạn có chắc chắn muốn xóa đợt thu phí <strong>{deletingFeeCollection.CollectionName}</strong>?</>
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