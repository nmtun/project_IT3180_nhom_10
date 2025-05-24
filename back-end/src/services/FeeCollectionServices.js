import FeeCollection from "../models/FeeCollection.js";

// Lấy tất cả đợt thu phí
export const getAllFeeCollections = async () => {
  return await FeeCollection.findAll();
};

// Lấy đợt thu phí theo ID
export const getFeeCollectionById = async (id) => {
  return await FeeCollection.findByPk(id);
};

// Thêm đợt thu phí mới
export const createFeeCollection = async (data) => {
  return await FeeCollection.create(data);
};

// Cập nhật đợt thu phí
export const updateFeeCollection = async (id, data) => {
  const feeCollection = await FeeCollection.findByPk(id);
  if (!feeCollection) return null;
  await feeCollection.update(data);
  return feeCollection;
};

// Xóa đợt thu phí
export const deleteFeeCollection = async (id) => {
  const feeCollection = await FeeCollection.findByPk(id);
  if (!feeCollection) return null;
  await feeCollection.destroy();
  return true;
};