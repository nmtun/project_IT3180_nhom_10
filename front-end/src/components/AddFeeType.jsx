import React, { useState, useEffect } from "react";
import "../styles/AddFeeType.css";

const AddFeeType = ({ open, onClose, onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    feeTypeName: "",
    category: "Bắt buộc",
    scope: "Chung",
    unitPrice: "",
    unit: "",
    description: ""
  });

  useEffect(() => {
    if (!open) return; // Không làm gì nếu form chưa mở

    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        feeTypeName: initialData.FeeTypeName || "",
        category: initialData.Category || "Bắt buộc",
        scope: initialData.Scope || "Chung",
        unitPrice: initialData.UnitPrice || "",
        unit: initialData.Unit || "",
        description: initialData.Description || ""
      });
    } else {
      setForm({
        feeTypeName: "",
        category: "Bắt buộc",
        scope: "Chung",
        unitPrice: "",
        unit: "",
        description: ""
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.feeTypeName.trim()) {
      alert("Vui lòng nhập tên loại phí!");
      return;
    }
    if (!form.category) {
      alert("Vui lòng chọn loại!");
      return;
    }
    if (!form.scope) {
      alert("Vui lòng chọn phạm vi!");
      return;
    }
    onSubmit({
      FeeTypeName: form.feeTypeName.trim(),
      Category: form.category,
      Scope: form.scope,
      UnitPrice: form.unitPrice ? Number(form.unitPrice) : null,
      Unit: form.unit.trim(),
      Description: form.description.trim()
    });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay-feetype">
      <div className="modal-form-new">
        <h2>{initialData && Object.keys(initialData).length > 0 ? "Chỉnh sửa loại phí" : "Thêm loại phí"}</h2>
        <form onSubmit={handleSubmit} className="add-fee-type-form">
          <div className="form-group">
            <label>Tên loại phí:</label>
            <input
              type="text"
              name="feeTypeName"
              value={form.feeTypeName}
              onChange={handleChange}
              placeholder="Nhập tên loại phí"
              required
            />
          </div>
          <div className="form-group">
            <label>Loại:</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="Bắt buộc">Bắt buộc</option>
              <option value="Tự nguyện">Tự nguyện</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phạm vi:</label>
            <select name="scope" value={form.scope} onChange={handleChange}>
              <option value="Chung">Chung</option>
              <option value="Riêng">Riêng</option>
            </select>
          </div>
          <div className="form-group">
            <label>Đơn giá:</label>
            <input
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              placeholder="Nhập đơn giá"
            />
          </div>
          <div className="form-group">
            <label>Đơn vị:</label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Nhập đơn vị"
            />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả (nếu có)"
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit">Lưu</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeeType;