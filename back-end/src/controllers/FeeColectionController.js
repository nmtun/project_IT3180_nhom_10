import * as feeColectionServices from '../services/FeeColectionServices.js';

// Lấy tất cả đợt thu phí
export const getAllFeeColections = async (req, res) => {
  try {
    const feeColections = await feeColectionServices.getAllFeeColections();
    res.status(200).json({ error: false, feeColections });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee colections', error });
  }
};

// Lấy đợt thu phí theo ID
export const getFeeColectionById = async (req, res) => {
  try {
    const feeColection = await feeColectionServices.getFeeColectionById(req.params.id);
    if (!feeColection) return res.status(404).json({ error: true, message: 'FeeColection not found' });
    res.status(200).json({ error: false, feeColection });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee colection', error });
  }
};

// Thêm đợt thu phí mới
export const createFeeColection = async (req, res) => {
  try {
    const { Name, Description, StartDate, EndDate } = req.body;
    if (!Name || !StartDate || !EndDate) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    const newFeeColection = await feeColectionServices.createFeeColection({ Name, Description, StartDate, EndDate });
    res.status(201).json({ error: false, feeColection: newFeeColection });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating fee colection', error });
  }
};

// Cập nhật đợt thu phí
export const updateFeeColection = async (req, res) => {
  try {
    const updated = await feeColectionServices.updateFeeColection(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: true, message: 'FeeColection not found' });
    res.status(200).json({ error: false, feeColection: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating fee colection', error });
  }
};

// Xóa đợt thu phí
export const deleteFeeColection = async (req, res) => {
  try {
    const deleted = await feeColectionServices.deleteFeeColection(req.params.id);
    if (!deleted) return res.status(404).json({ error: true, message: 'FeeColection not found' });
    res.status(200).json({ error: false, message: 'FeeColection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting fee colection', error });
  }
};