import FeeDetail from '../models/FeeDetail.js'; 
import Household from '../models/Household.js';

// Lấy tất cả chi tiết phí
export const getAllFeeDetails = async () => {
  return await FeeDetail.findAll();
};

export const getFeeDetailsByCollectionId = (feeCollectionId) => {
  return FeeDetail.findAll({
    where: { CollectionID: feeCollectionId },
    include: [
      {
        model: Household,
        attributes: ['HouseholdID', 'HouseholdHead'] // lấy những gì bạn cần
      }
    ]
  });
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

// Thống kê số liệu cho 1 đợt thu phí
export const getFeeDetailStatsByCollectionId = async (feeCollectionId) => {
  // tổng số hộ
  const totalHouseholds = await FeeDetail.count({
    where: { CollectionID: feeCollectionId }
  });

  // số đã đóng (PaymentStatus = 'Đã đóng')
  const paidCount = await FeeDetail.count({
    where: {
      CollectionID: feeCollectionId,
      PaymentStatus: 'Đã đóng'
    }
  });

  // số chưa đóng
  const unpaidCount = totalHouseholds - paidCount;

  // tổng tiền thu được
  const totalCollected = await FeeDetail.sum('Amount', {
    where: {
      CollectionID: feeCollectionId,
      PaymentStatus: 'Đã đóng'
    }
  });

  const totalRemaining = await FeeDetail.sum('Amount',{
    where: {
      CollectionID: feeCollectionId,
      PaymentStatus: 'Chưa đóng'
    }
  });

  return {
    totalHouseholds,
    paidCount,
    unpaidCount,
    totalCollected: totalCollected || 0,
    totalRemaining: totalRemaining || 0
  };
};
