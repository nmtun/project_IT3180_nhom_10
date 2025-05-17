import FeeDetail from '../models/FeeDetail.js';

// Lấy tất cả chi tiết phí
export const getAllFeeDetails = async () => {
  return await FeeDetail.findAll();
};

// Lấy chi tiết phí theo ID
export const getFeeDetailById = async (id) => {
  return await FeeDetail.findByPk(id);
};

// Thêm chi tiết phí mới
export const createFeeDetail = async (data) => {
  return await FeeDetail.create(data);
};

// Cập nhật chi tiết phí
export const updateFeeDetail = async (id, data) => {
  const feeDetail = await FeeDetail.findByPk(id);
  if (!feeDetail) return null;
  await feeDetail.update(data);
  return feeDetail;
};

// Xóa chi tiết phí
export const deleteFeeDetail = async (id) => {
  const feeDetail = await FeeDetail.findByPk(id);
  if (!feeDetail) return null;
  await feeDetail.destroy();
  return true;
};