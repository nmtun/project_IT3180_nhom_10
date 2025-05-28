import React from 'react';
import '../styles/FeeDetailTable.css'; // Import your CSS styles

const FeeDetailTable = ({ details, onStatusChange, feeType }) => {
  // Lọc bỏ các bản ghi có Amount = 0 hoặc null
  const filteredDetails = (details || []).filter(d => parseInt(d.Amount || 0) > 0);

  if (!filteredDetails || filteredDetails.length === 0) {
    return <p>Chưa có dữ liệu nộp phí cho đợt thu này.</p>;
  }

  return (
    <div className="fee-detail-table-wrapper">
      <table className="fee-detail-table">
        <thead>
          <tr>
            <th>Hộ gia đình</th>
            <th>Số tiền cần đóng</th>
            <th>Trạng thái</th>
            <th>Phương thức</th>
            <th>Ngày thanh toán</th>
            <th>Đã thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {filteredDetails.map((d, i) => (
            <tr key={i}>
              <td>{d.Household?.HouseholdHead || `Hộ ID ${d.HouseholdID}`}</td>
              <td>
                {feeType?.Scope === "Chung"
                  ? parseInt(feeType.UnitPrice || 0).toLocaleString() + " VNĐ"
                  : parseInt(d.Amount || 0).toLocaleString() + " VNĐ"}
              </td>
              <td>
                <span className={`payment-status ${d.PaymentStatus === 'Đã đóng' ? 'paid' : 'unpaid'}`}>
                  {d.PaymentStatus}
                </span>
              </td>
              <td>
                <select
                  value={d.PaymentMethod || 'Tiền mặt'}
                  onChange={e => onStatusChange(d.FeeDetailID, d.PaymentStatus === 'Đã đóng', e.target.value)}
                  disabled={d.PaymentStatus == 'Đã đóng'}
                >
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                </select>
              </td>
              <td>{d.PaymentDate ? new Date(d.PaymentDate).toLocaleDateString() : '—'}</td>
              <td>
                <input
                  type="checkbox"
                  checked={d.PaymentStatus === 'Đã đóng'}
                  onChange={ e => onStatusChange(d.FeeDetailID, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeDetailTable;
