import React from 'react';
import{ useState, useEffect } from 'react';
import axiosInstance from '../untils/axiosIntance';
import '../styles/AddFeeCollection.css';
import AddFeeType from './AddFeeType';
const AddFeeCollection = ({ open, onClose, onSubmit, initialData = {} }) => {
    const [feeType, setFeeType] = React.useState([]);
    const [showAddFeeType, setShowAddFeeType] = React.useState(false);

    React.useEffect(() => {
        const fetchFeeType = async () => {
            try {
                const response = await axiosInstance.get('/fee-type/get-all-fee-type'); 
                setFeeType(response.data.feeTypes || response.data); // tuỳ theo cấu trúc backend
            } catch (error) {
                console.error("Lỗi khi lấy danh sách loại phí:", error);
            }
        };

        fetchFeeType();
    }, []);

    const [form, setForm] = useState({
        collectionName: '',
        startDate: '',
        endDate: '',
        status: 'Đang thu',
        notes: '',
        feeTypeId: ''
    });

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm({
                collectionName: initialData.CollectionName || '',
                startDate: initialData.StartDate || '',
                endDate: initialData.EndDate || '',
                status: initialData.Status || 'Đang thu',
                notes: initialData.Notes || '',
                feeTypeId: initialData.FeeTypeID ? String(initialData.FeeTypeID) : ''
            });
        } else {
            // reset về form trống nếu không có dữ liệu chỉnh sửa
            setForm({
                collectionName: '',
                startDate: '',
                endDate: '',
                status: 'Đang thu',
                notes: '',
                feeTypeId: ''
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.collectionName.trim() === '' || form.startDate.trim() === '' ) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        } 
        if (!form.feeTypeId) {
            alert('Vui lòng chọn loại phí');
            return;
        }
        
        const formattedForm = {
            FeeTypeID: Number(form.feeTypeId),
            CollectionName: form.collectionName,
            StartDate: form.startDate,
            EndDate: form.endDate || null,
            Status: form.status,
            Notes: form.notes || ''
        };

        console.log('Data being sent:', formattedForm);
        onSubmit(formattedForm);
    };

    if (!open) return null;

    return (
        <>
        <div className="modal-overlay">
            <div className="modal-form-new">
                <h2>{initialData ? 'Chỉnh sửa đợt thu phí' : 'Thêm đợt thu phí'}</h2>
                <form onSubmit={handleSubmit} className="add-fee-collection-form">
                    <div className="form-group">
                        <label>Tên đợt thu:</label>
                        <input
                            type="text"
                            name="collectionName"
                            placeholder="Nhập tên đợt thu phí"
                            value={form.collectionName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày bắt đầu:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày kết thúc:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div className="form-group">
                        <label>Số tiền:</label>
                        <input
                            type="number"
                            name="totalAmount"
                            value={form.totalAmount}
                            placeholder="Số tiền thu (VNĐ)"
                            onChange={handleChange}
                        />
                    </div> */}
                    <div className="form-group">
                        <label>Trạng thái:</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="Đang thu">Đang thu</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Kết thúc">Kết thúc</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Ghi chú:</label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Ghi chú (nếu có)"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Loại phí:</label>
                        <select name="feeTypeId" value={form.feeTypeId} onChange={handleChange} required>
                            <option value="">Chọn loại phí</option>
                            {feeType.map((type) => (
                                <option key={type.FeeTypeID} value={String(type.FeeTypeID)}>
                                    {type.FeeTypeName}
                                </option>
                            ))} 
                        </select>
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="add-fee-type-inline-btn"
                            onClick={() => setShowAddFeeType(true)}
                            >
                            + Thêm loại phí mới
                        </button>
                    </div>
                    <div>
                        <div className="form-actions">
                            <button type='submit'>Lưu</button>
                            <button type='button' onClick={onClose}>Hủy</button>
                        </div>
                    </div>
                </form>   
            </div>
        </div>
        <AddFeeType
                open={showAddFeeType}
                initialData={null} 
                onClose={() => setShowAddFeeType(false)}
                onSubmit={async (data) => {
                    try {
                        const res = await axiosInstance.post('/fee-type/create-fee-type', data);
                        const created = res.data.feeType || res.data;

                        //✅ Thêm loại mới vào dropdown và chọn nó luôn
                        setFeeType((prev) => [...prev, created]);
                        setForm((prev) => ({
                            ...prev,
                            feeTypeId: String(created.FeeTypeID),
                    }));

                    setShowAddFeeType(false);
                    } catch (err) {
                    console.error("Lỗi khi thêm loại phí:", err);
                    }
                }}
            />
        </>
    );
};

export default AddFeeCollection;

