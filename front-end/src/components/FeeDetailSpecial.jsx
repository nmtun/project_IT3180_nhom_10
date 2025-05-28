/* eslint-disable no-unused-vars */
import React from 'react';
import axiosInstance from '../untils/axiosIntance';
import '../styles/FeeDetailSpecial.css';

const FeeDetailSpecial = ({CollectionID, FeeTypeName}) => {
  const [households, setHouseholds] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    HouseholdID: '',
    amount: '',
  });
  const [records, setRecords] = React.useState([]);

  React.useEffect(() => {
    const loadHouseholds = async () => {
      try {
        const res = await axiosInstance.get('/households/get-all-households');
        setHouseholds(res.data.households || res.data);
      } catch (err) {
        setHouseholds([]);
      }
    };
    loadHouseholds();
  }, []);

  // Fetch fee detail records
  const fetchRecords = async () => {
    try {
      const res = await axiosInstance.get('/fee-detail/get-all-fee-detail', {
        params: { feeCollectionId: CollectionID }
      });
      // Gắn thêm thông tin household vào record
      const data = res.data.feeDetails || [];
      const recordsWithInfo = data.map(rec => {
        const hh = households.find(h => h.HouseholdID === rec.HouseholdID);
        return {
          ...rec,
          RoomNumber: hh?.RoomNumber,
          HouseholdHead: hh?.HouseholdHead,
          method: rec.PaymentMethod || "Tiền mặt",
          paid: rec.PaymentStatus === "Đã đóng",
          date: rec.PaymentDate,
          amount: rec.Amount,
        };
      });
      setRecords(recordsWithInfo);
    } catch (err) {
      setRecords([]);
    }
  };

  // Fetch records mỗi khi CollectionID hoặc households thay đổi
  React.useEffect(() => {
    if (CollectionID && households.length > 0) {
      fetchRecords();
    }
    // eslint-disable-next-line
  }, [CollectionID, households]);

  const handleFormChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddRecord = async () => {
    if (!form.HouseholdID || !form.amount) {
      alert('Vui lòng chọn phòng và nhập số tiền!');
      return;
    }
    try {
      await axiosInstance.post('/fee-detail/create-fee-detail', {
        CollectionID: CollectionID,
        HouseholdID: form.HouseholdID,
        Amount: form.amount,
        PaymentStatus: "Chưa đóng",
        PaymentMethod: "Tiền mặt",
        PaymentDate: null,
      });
      setShowForm(false);
      setForm({
        HouseholdID: '',
        amount: '',
      });
      // Fetch lại records sau khi thêm mới
      fetchRecords();
    } catch (error) {
      alert('Tạo hóa đơn thất bại!');
      console.error(error?.response?.data || error);
    }
  };
  
  const handleCheckPaid = async (rec) => {
    try {
      await axiosInstance.put(`/fee-detail/update-fee-detail/${rec.FeeDetailID}`, {
        PaymentStatus: "Đã đóng",
        PaymentMethod: rec.method,
        PaymentDate: new Date(),
      });
      fetchRecords();
    } catch (error) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  // Lọc households theo loại phí
  const filteredHouseholds = React.useMemo(() => {
    if (FeeTypeName === "Phí gửi xe") {
      return households.filter(hh => hh.HasVehicle === true);
    }
    return households;
  }, [households, FeeTypeName]);

  return (
    <div className="fee-detail-table-wrapper add-record-relative">
      <button className="create-record-btn" onClick={() => setShowForm(true)}>Thêm hóa đơn</button>

      {showForm && (
        <>
          <div onClick={() => setShowForm(false)} />
          <div className="side-modal-form">
            <h3>Thêm hóa đơn</h3>
            <select
              className="form-select"
              value={form.HouseholdID}
              onChange={e => handleFormChange('HouseholdID', e.target.value)}
            > 
              <option value="">Chọn phòng</option>
              {filteredHouseholds.map(hh => (
                <option key={hh.HouseholdID} value={hh.HouseholdID}>
                  {hh.RoomNumber} - {hh.HouseholdHead}
                </option>
              ))}
            </select>
            <input
              className="form-input"
              type="number"
              placeholder="Số tiền"
              min="0"
              value={form.amount}
              onChange={e => handleFormChange('amount', e.target.value)}
            />
            <button className="form-save-btn" onClick={handleAddRecord}>Lưu</button>
            <button className="form-cancel-btn" onClick={() => setShowForm(false)}>Hủy</button>
          </div>
        </>
      )}

      {records.length > 0 && (
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
            {records.map((rec, idx) => (
              <tr key={idx}>
                <td>{rec.HouseholdHead}</td>
                <td>{parseInt(rec.amount || 0).toLocaleString()} VNĐ</td>
                <td>
                  <span className={`payment-status ${rec.paid ? 'paid' : 'unpaid'}`}>
                    {rec.PaymentStatus}
                  </span>
                </td>
                <td>
                  <select
                    value={rec.method}
                    onChange={e => {
                      const newMethod = e.target.value;
                      setRecords(prev =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, method: newMethod } : item
                        )
                      );
                    }}
                    disabled={rec.paid}
                  >
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                  </select>
                </td>
                <td>{rec.date ? new Date(rec.date).toLocaleDateString() : '—'}</td>
                <td className="checkbox-cell">
                  <input
                    type="checkbox"
                    checked={rec.paid}
                    disabled={rec.paid}
                    onChange={() => handleCheckPaid(rec)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeeDetailSpecial;
