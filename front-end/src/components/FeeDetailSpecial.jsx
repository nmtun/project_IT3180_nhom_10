import React from 'react';
import axiosInstance from '../untils/axiosIntance';

const FeeDetailSpecial = ({ details, CollectionID }) => {
  if (!details || details.length === 0) {
    return <p>Chưa có dữ liệu nộp phí cho đợt thu này.</p>;
  }

    // state giữ danh sách hộ
  const [households, setHouseholds] = React.useState([]);
  // state giữ amount nhập cho từng hộ: { [HouseholdID]: 'số nhập' }
  const [amounts, setAmounts] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadHouseholds = async () => {
      try {
        const res = await axiosInstance.get('/households/get-all-households');
        const list = res.data.households || res.data;
        setHouseholds(list);
        // khởi tạo amounts = '' cho mỗi hộ
        const init = {};
        list.forEach(hh => { init[hh.HouseholdID] = ''; });
        setAmounts(init);
      } catch (err) {
        console.error('fetch households error', err);
      }
    };
    loadHouseholds();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // build payload: mỗi phần tử có HouseholdID, AmountDue, FeeTypeID (từ props)
      const payload = households.map(hh => ({
        CollectionID, 
        HouseholdID: hh.HouseholdID,
        Amount: parseFloat(amounts[hh.HouseholdID]) || 0,
        PaymentStatus: "Chưa đóng",
        PaymentDate: null,
        PaymentMethod: "Tiền mặt"
      }));
      await axiosInstance.post(`fee-detail/create-fee-detail`, payload);
      alert('Gửi thành công!');
    } catch (err) {
      console.error(err);
      alert('Gửi thất bại, thử lại sau.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fee-detail-special">
      <div className="fee-detail-special">
        <table>
          <thead>
            <tr>
              <th>Household</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {households.map(hh => (
              <tr key={hh.HouseholdID}>
                <td>{hh.RoomNumber} - {hh.HouseholdHead}</td>
                <td>
                  <input
                    type="number"
                    value={amounts[hh.HouseholdID]}
                    onChange={e => setAmounts({
                      ...amounts,
                      [hh.HouseholdID]: e.target.value
                    })}
                    placeholder="Nhập số tiền"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang gửi…' : 'Gửi'}
        </button>
      </div>
    </div>
  );
};

export default FeeDetailSpecial;
