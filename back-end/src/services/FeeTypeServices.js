import FeeType from '../models/FeeType.js';

// Lấy tất cả loại phí
export const getAllFeeTypes = async () => {
  return await FeeType.findAll();
};

// Lấy loại phí theo ID
export const getFeeTypeById = async (id) => {
  return await FeeType.findByPk(id);
};

// Thêm loại phí mới
export const createFeeType = async (data) => {
  return await FeeType.create(data);
};

// Cập nhật loại phí
export const updateFeeType = async (id, data) => {
  const feeType = await FeeType.findByPk(id);
  if (!feeType) return null;
  await feeType.update(data);
  return feeType;
};

// Xóa loại phí
export const deleteFeeType = async (id) => {
  const feeType = await FeeType.findByPk(id);
  if (!feeType) return null;
  await feeType.destroy();
  return true;
};