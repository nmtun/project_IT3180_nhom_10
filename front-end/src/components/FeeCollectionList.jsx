import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const FeeCollectionList = ({ feeCollections, onEdit, onDeleteRequest, onSelect }) => {
  if (!feeCollections || feeCollections.length === 0) {
    return <p>Không có đợt thu phí nào.</p>;
  }

  return (
    <div className="fee-list">
      {feeCollections.map((item, idx) => (
        <div
          className="fee-row"
          key={item.CollectionID || idx}
          onClick={() => onSelect(item)}
          style={{ cursor: 'pointer' }}
        >
          <span><b>Tên đợt thu phí:</b> {item.CollectionName}</span>
          <span><b>Loại phí:</b> {item.FeeType?.FeeTypeName || '-'}</span>
          <span><b>Danh mục:</b> {item.FeeType?.Category || '-'}</span>
          <span><b>Trạng thái:</b> {item.Status}</span>
          <span className="fee-actions">
            <FaEdit
              className="icon-action edit"
              title="Sửa"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            />
            <FaTrash
              className="icon-action delete"
              title="Xóa"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(item);;
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeeCollectionList;
