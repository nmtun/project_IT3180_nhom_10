import React from 'react';
import{ useState, useEffect } from 'react';
import '../styles/AddResident.css'; 
import axiosInstance from '../untils/axiosIntance';

const AddResident = ({ open, onClose, onSubmit, initialData = {} }) => {
  const [households, setHouseholds] = React.useState([]);
  React.useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await axiosInstance.get('/households/get-all-households'); // API trả về danh sách hộ
        setHouseholds(response.data.households || response.data); // tuỳ theo cấu trúc backend
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hộ:", error);
      }
    };

    fetchHouseholds();
  }, []);

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    sex: 'Nam',
    relationship: 'Vợ/Chồng',
    phoneNumber: '',
    educationLevel: '',
    occupation: '',
    residencyStatus: 'Tạm trú',
    registrationDate: '',
    householdId: ''
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        fullName: initialData.FullName || '',
        dateOfBirth: initialData.DateOfBirth || '',
        sex: initialData.Sex || 'Nam',
        relationship: initialData.Relationship || 'Vợ/Chồng',
        phoneNumber: initialData.PhoneNumber || '',
        educationLevel: initialData.EducationLevel || '',
        occupation: initialData.Occupation || '',
        residencyStatus: initialData.ResidencyStatus || 'Tạm trú',
        registrationDate: initialData.RegistrationDate || '',
        householdId: initialData.HouseholdID || ''
      });
    }else {
        // reset về form trống nếu không có dữ liệu chỉnh sửa
        setForm({
          fullName: '',
          dateOfBirth: '',
          sex: 'Nam',
          relationship: 'Vợ/Chồng',
          phoneNumber: '',
          educationLevel: '',
          occupation: '',
          residencyStatus: 'Tạm trú',
          registrationDate: '',
          householdId: ''
        });
      }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      return;
    }
    if (!form.householdId) {
      alert('Vui lòng chọn hộ gia đình');
      return;
    }

    const formattedForm = {
      HouseholdID: Number(form.householdId),
      FullName: form.fullName.trim(),
      Sex: form.sex,
      Relationship: form.relationship,
      ...(form.residencyStatus && { ResidencyStatus: form.residencyStatus }),
      ...(form.dateOfBirth && { DateOfBirth: form.dateOfBirth }),
      ...(form.phoneNumber?.trim() && { PhoneNumber: form.phoneNumber.trim() }),
      ...(form.educationLevel?.trim() && { EducationLevel: form.educationLevel.trim() }),
      ...(form.occupation?.trim() && { Occupation: form.occupation.trim() }),
      ...(form.registrationDate && { RegistrationDate: form.registrationDate })
    };
    
    console.log('Data being sent:', formattedForm);
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

          <select name="householdId" value={form.householdId} onChange={handleChange} required>
            <option value="">-- Chọn hộ gia đình --</option>
            {households.map(h => (
              <option key={h.HouseholdID} value={h.HouseholdID}>
                {`Hộ ID ${h.HouseholdID} - ${h.HouseholdHead || 'Chưa có tên'}`}
              </option>
            ))}
          </select>

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
