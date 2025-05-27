import React from 'react';
import '../styles/FeeDetailTable.css'; // Import your CSS styles

const FeeDetailTable = ({ details, onStatusChange }) => {
  if (!details || details.length === 0) {
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
            <th>Đã thanh toán</th>
            <th>Phương thức</th>
            <th>Ngày thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {details.map((d, i) => (
            <tr key={i}>
              <td>{d.Household?.HouseholdHead || `Hộ ID ${d.HouseholdID}`}</td>
              <td>{parseInt(d.Amount || 0).toLocaleString()} VNĐ</td>
              <td>
                <span className={`payment-status ${d.PaymentStatus === 'Đã đóng' ? 'paid' : 'unpaid'}`}>
                  {d.PaymentStatus}
                </span>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={d.PaymentStatus === 'Đã đóng'}
                  onChange={ e => onStatusChange(d.FeeDetailID, e.target.checked/*, d.HouseholdID */)}
                />
              </td>  
              <td>{d.PaymentMethod || '—'}</td>
              {/* <td>{d.PaymentDate || '—'}</td> */}
              <td>{d.PaymentDate ? new Date(d.PaymentDate).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeDetailTable;
