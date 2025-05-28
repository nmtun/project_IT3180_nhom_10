/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../styles/FeeType.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import AddButton from "../components/AddButton";
import Toast from "../components/Toast";
import axiosIntance from "../untils/axiosIntance";
import AddFeeType from "../components/AddFeeType"; // Thêm dòng này
import { FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmModal from "../components/DeleteConfirmModal"; 

const FeeType = () => {
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [search, setSearch] = useState('');
  const [feeTypes, setFeeTypes] = useState([]);
  const [showAddFeeType, setShowAddFeeType] = useState(false);
  const [editFeeType, setEditFeeType] = useState(null);
  const [selectedFeeType, setSelectedFeeType] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [deletingFeeType, setDeletingFeeType] = useState(null);

  // Fetch danh sách loại phí
  useEffect(() => {
    fetchFeeTypes();
  }, []);
  const fetchFeeTypes = async () => {
    try {
      const res = await axiosIntance.get('/fee-type/get-all-fee-type');
      setFeeTypes(res.data.feeTypes || res.data);
    } catch {
      setFeeTypes([]);
    }
  };

  // Lọc theo search
  const filteredFeeTypes = feeTypes.filter(
    ft =>
      ft.FeeTypeName?.toLowerCase().includes(search.toLowerCase()) ||
      ft.Category?.toLowerCase().includes(search.toLowerCase())
  );

  // Xử lý thêm/sửa loại phí
  const handleAddOrEditFeeType = async (data) => {
    try {
      if (editFeeType) {
        await axiosIntance.put(`/fee-type/update-fee-type/${editFeeType.FeeTypeID}`, data);
        setToast({ message: "Cập nhật loại phí thành công!", type: "success" });
      } else {
        await axiosIntance.post('/fee-type/create-fee-type', data);
        setToast({ message: "Thêm loại phí thành công!", type: "success" });
      }
      setShowAddFeeType(false);
      setEditFeeType(null);
      fetchFeeTypes();
    } catch (error) {
      setToast({ message: "Có lỗi xảy ra!", type: "error" });
    }
  };

  // Xử lý xóa loại phí
  const handleDeleteFeeType = async () => {
    if (!deletingFeeType) return;
    try {
      await axiosIntance.delete(`/fee-type/delete-fee-type/${deletingFeeType.FeeTypeID}`);
      setToast({ message: "Xóa loại phí thành công!", type: "success" });
      setDeletingFeeType(null);
      fetchFeeTypes();
    } catch (error) {
      setToast({ message: "Xóa loại phí thất bại!", type: "error" });
      setDeletingFeeType(null);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: '' })}
      />
      <div className="fee-type-container">
        <Header />
        <div className="fee-type-body">
          <Sidebar open={open} setOpen={setOpen} />
          <div className={`fee-type-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div className="fee-type-title">
              <h1>Danh sách các loại phí:</h1>
              <div className="fee-type-search">
                <SearchBar
                  placeholder="Tìm kiếm loại phí..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="fee-type-list">
              {filteredFeeTypes.map((ft, idx) => (
                <div
                  className="fee-type-row"
                  key={ft.FeeTypeID || idx}
                  onClick={() => setSelectedFeeType(ft)}
                  style={{ cursor: 'pointer' }}
                >
                  <span><b>Tên loại phí: </b>{ft.FeeTypeName}</span>
                  <span>
                    <b>Loại: </b>
                    <span
                      className={
                        ft.Category === "Bắt buộc"
                          ? "fee-type-category compulsory"
                          : "fee-type-category voluntary"
                      }
                    >
                      {ft.Category}
                    </span>
                  </span>
                  <span><b>Mô tả: </b>{ft.Description}</span>
                  <span className="fee-type-actions" onClick={e => e.stopPropagation()}>
                    <FaEdit
                      className="icon-action edit"
                      title="Sửa"
                      onClick={() => { setEditFeeType(ft); setShowAddFeeType(true); }}
                    />
                    <FaTrash
                      className="icon-action delete"
                      title="Xóa"
                      onClick={() => setDeletingFeeType(ft)}
                    />
                  </span>
                </div>
              ))}
              {filteredFeeTypes.length === 0 && (
                <div className="fee-type-row">Không có loại phí nào.</div>
              )}
            </div>
            <AddButton onClick={() => { setShowAddFeeType(true); setEditFeeType(null); }} />
            <AddFeeType
              open={showAddFeeType}
              onClose={() => { setShowAddFeeType(false); setEditFeeType(null); }}
              onSubmit={handleAddOrEditFeeType}
              initialData={editFeeType}
            />
            <DeleteConfirmModal
              open={!!deletingFeeType}
              title="Xác nhận xóa loại phí"
              message={
                deletingFeeType
                  ? <>Bạn có chắc chắn muốn xóa loại phí <b>{deletingFeeType.FeeTypeName}</b>?</>
                  : ""
              }
              onConfirm={handleDeleteFeeType}
              onCancel={() => setDeletingFeeType(null)}
            />
          </div>
        </div>
        <Navbar />
      </div>
      {selectedFeeType && (
  <div className="modal-overlay" onClick={() => setSelectedFeeType(null)}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <h2>Chi tiết loại phí</h2>
      <p><b>Tên loại phí:</b> {selectedFeeType.FeeTypeName}</p>
      <p>
        <b>Loại:</b>{" "}
        <span
          className={
            selectedFeeType.Category === "Bắt buộc"
              ? "fee-type-category compulsory"
              : "fee-type-category voluntary"
          }
        >
          {selectedFeeType.Category}
        </span>
      </p>
      <p><b>Phạm vi:</b> {selectedFeeType.Scope || '---'}</p>
      <p>
        <b>Đơn giá:</b>{" "}
        {selectedFeeType.UnitPrice
          ? selectedFeeType.UnitPrice
          : "Tùy thuộc vào từng hộ"}
      </p>
      <p><b>Đơn vị:</b> {selectedFeeType.Unit}</p>
      <p><b>Mô tả:</b> {selectedFeeType.Description || '---'}</p>
      <button className="modal-cancel" onClick={() => setSelectedFeeType(null)}>Đóng</button>
    </div>
  </div>
)}
    </>
  );
};

export default FeeType;