import FeeColection from "../models/FeeColection.js";

// Lấy tất cả đợt thu phí
export const getAllFeeColections = async () => {
  return await FeeColection.findAll();
};

// Lấy đợt thu phí theo ID
export const getFeeColectionById = async (id) => {
  return await FeeColection.findByPk(id);
};

// Thêm đợt thu phí mới
export const createFeeColection = async (data) => {
  return await FeeColection.create(data);
};

// Cập nhật đợt thu phí
export const updateFeeColection = async (id, data) => {
  const feeColection = await FeeColection.findByPk(id);
  if (!feeColection) return null;
  await feeColection.update(data);
  return feeColection;
};

// Xóa đợt thu phí
export const deleteFeeColection = async (id) => {
  const feeColection = await FeeColection.findByPk(id);
  if (!feeColection) return null;
  await feeColection.destroy();
  return true;
};