import React, { useState, useEffect } from 'react';
import '../styles/AddResident.css'; // Bạn cần CSS riêng cho form popup

const AddResident = ({ open, onClose, onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    sex: 'Nam',
    relationship: 'Chủ hộ',
    phoneNumber: '',
    educationLevel: '',
    occupation: '',
    residencyStatus: 'Tạm trú',
    registrationDate: '',
    householdId: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.FullName || '',
        dateOfBirth: initialData.DateOfBirth || '',
        sex: initialData.Sex || 'Nam',
        relationship: initialData.Relationship || 'Chủ hộ',
        phoneNumber: initialData.PhoneNumber || '',
        educationLevel: initialData.EducationLevel || '',
        occupation: initialData.Occupation || '',
        residencyStatus: initialData.ResidencyStatus || 'Tạm trú',
        registrationDate: initialData.RegistrationDate || '',
        householdId: initialData.HouseholdID || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit(form);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedForm = {
      ...form,
      householdId: Number(form.householdId)  // ép kiểu ở đây
    };  

    onSubmit(formattedForm);
  };

  

  if (!open) return null;
  

  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <h2>{initialData ? 'Cập nhật nhân khẩu' : 'Thêm nhân khẩu'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Họ tên" required />
          
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} placeholder="Ngày sinh" />
          
          <select name="sex" value={form.sex} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <select name="relationship" value={form.relationship} onChange={handleChange}>
            <option value="Chủ hộ">Chủ hộ</option>
            <option value="Vợ/chồng">Vợ/chồng</option>
            <option value="Con">Con</option>
            <option value="Cha/mẹ">Cha/mẹ</option>
            <option value="Khác">Khác</option>
          </select>

          <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" />

          <input type="text" name="educationLevel" value={form.educationLevel} onChange={handleChange} placeholder="Trình độ học vấn" />

          <input type="text" name="occupation" value={form.occupation} onChange={handleChange} placeholder="Nghề nghiệp" />

          <select name="residencyStatus" value={form.residencyStatus} onChange={handleChange}>
            <option value="Thường trú">Thường trú</option>
            <option value="Tạm trú">Tạm trú</option>
            <option value="Tạm vắng">Tạm vắng</option>
            <option value="Đã chuyển đi">Đã chuyển đi</option>
          </select>

          <input type="date" name="registrationDate" value={form.registrationDate} onChange={handleChange} placeholder="Ngày đăng ký" />

          <input type="text" name="householdId" value={form.householdId} onChange={handleChange} placeholder="Mã hộ gia đình" required />

          <div className="form-actions">
            <button type="submit">Lưu</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResident;
