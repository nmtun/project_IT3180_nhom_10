import React from "react";
import "../styles/DeleteConfirmModal.css";

const DeleteConfirmModal = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="delete-modal">
      <div className="delete-modal-content">
        <h2>{title || "Xác nhận xóa"}</h2>
        <p>{message}</p>
        <div className="delete-modal-buttons">
          <button className="confirm-delete-button" onClick={onConfirm}>
            Xác nhận xóa
          </button>
          <button className="cancel-delete-button" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;