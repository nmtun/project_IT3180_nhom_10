import * as feeDetailServices from '../services/FeeDetailServices.js';

// Lấy tất cả chi tiết phí
export const getAllFeeDetails = async (req, res) => {
  try {
    const feeDetails = await feeDetailServices.getAllFeeDetails();
    res.status(200).json({ error: false, feeDetails });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee details', error });
  }
};

// Lấy chi tiết phí theo ID
export const getFeeDetailById = async (req, res) => {
  try {
    const feeDetail = await feeDetailServices.getFeeDetailById(req.params.id);
    if (!feeDetail) return res.status(404).json({ error: true, message: 'FeeDetail not found' });
    res.status(200).json({ error: false, feeDetail });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee detail', error });
  }
};

// Thêm chi tiết phí mới
export const createFeeDetail = async (req, res) => {
  try {
    //console.log("CREATE FeeDetail req.body:", req.body);
    const { CollectionID, HouseholdID, AmountDue, AmountPaid, PaymentDate, PaymentMethod, PaymentStatus, Notes } = req.body;
    if (!CollectionID || !HouseholdID || !AmountDue || !PaymentMethod || !PaymentStatus) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    // Kiểm tra logic
    if (AmountPaid && parseFloat(AmountPaid) > parseFloat(AmountDue)) {
      return res.status(400).json({ error: true, message: 'AmountPaid cannot be greater than AmountDue' });
    }
    const newFeeDetail = await feeDetailServices.createFeeDetail({
      CollectionID, HouseholdID, AmountDue, AmountPaid, PaymentDate, PaymentMethod, PaymentStatus, Notes
    });
    res.status(201).json({ error: false, feeDetail: newFeeDetail });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating fee detail', error });
  }
};

// Cập nhật chi tiết phí
export const updateFeeDetail = async (req, res) => {
  try {
    const updated = await feeDetailServices.updateFeeDetail(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: true, message: 'FeeDetail not found' });
    res.status(200).json({ error: false, feeDetail: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating fee detail', error });
  }
};

// Xóa chi tiết phí
export const deleteFeeDetail = async (req, res) => {
  try {
    const deleted = await feeDetailServices.deleteFeeDetail(req.params.id);
    if (!deleted) return res.status(404).json({ error: true, message: 'FeeDetail not found' });
    res.status(200).json({ error: false, message: 'FeeDetail deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting fee detail', error });
  }
};