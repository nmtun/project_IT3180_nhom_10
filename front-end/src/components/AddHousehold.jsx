import React, { useState, useEffect } from 'react';
import '../styles/AddHousehold.css';

const AddHousehold = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    roomNumber: '',
    type: 'Đơn',
    householdHead: '',
    members: 1,
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        roomNumber: initialData.RoomNumber || '',
        type: initialData.Type || 'Đơn',
        householdHead: initialData.HouseholdHead || '',
        members: initialData.Members || 1,
        notes: initialData.Notes || ''
      });
    } else {
      setForm({
        roomNumber: '',
        type: 'Đơn',
        householdHead: '',
        members: 1,
        notes: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'members' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ roomNumber: '', type: 'Đơn', householdHead: '', members: 1, notes: '' });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Cập nhật hộ gia đình' : 'Thêm mới hộ gia đình'}</h2>
        <form onSubmit={handleSubmit} className="add-household-form">
          <div className="form-group">
            <label htmlFor="roomNumber">Số phòng</label>
            <input
              id="roomNumber"
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              placeholder="Nhập số phòng"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Loại phòng</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="Đơn">Đơn</option>
              <option value="Đôi">Đôi</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="householdHead">Tên chủ hộ</label>
            <input
              id="householdHead"
              type="text"
              name="householdHead"
              value={form.householdHead}
              onChange={handleChange}
              placeholder="Nhập tên chủ hộ"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="members">Số người</label>
            <input
              id="members"
              type="number"
              name="members"
              min={1}
              max={form.type === 'Đơn' ? 3 : 6}
              value={form.members}
              onChange={handleChange}
              placeholder="Nhập số người"
              required
            />
            <span className="input-note">
              {form.type === 'Đơn' ? 'Tối đa 3 người' : 'Tối đa 6 người'}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Ghi chú</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Ghi chú (nếu có)"
            />
          </div>
          <div className="household-modal-actions">
            <button type="button" className="household-modal-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="household-modal-submit">
              {initialData ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHousehold;
