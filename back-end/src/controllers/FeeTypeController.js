import * as feeTypeServices from '../services/FeeTypeServices.js';

// Lấy tất cả loại phí
export const getAllFeeTypes = async (req, res) => {
  try {
    const feeTypes = await feeTypeServices.getAllFeeTypes();
    res.status(200).json({ error: false, feeTypes });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee types', error });
  }
};

// Lấy loại phí theo ID
export const getFeeTypeById = async (req, res) => {
  try {
    const feeType = await feeTypeServices.getFeeTypeById(req.params.id);
    if (!feeType) return res.status(404).json({ error: true, message: 'FeeType not found' });
    res.status(200).json({ error: false, feeType });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee type', error });
  }
};

// Thêm loại phí mới
export const createFeeType = async (req, res) => {
  try {
    const { FeeTypeName, Description, Category, Scope, UnitPrice, Unit } = req.body;
    if (!FeeTypeName || !Category || !Scope) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    const newFeeType = await feeTypeServices.createFeeType({ FeeTypeName, Description, Category, Scope, UnitPrice, Unit });
    res.status(201).json({ error: false, feeType: newFeeType });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating fee type', error });
  }
};

// Cập nhật loại phí
export const updateFeeType = async (req, res) => {
  try {
    const updated = await feeTypeServices.updateFeeType(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: true, message: 'FeeType not found' });
    res.status(200).json({ error: false, feeType: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating fee type', error });
  }
};

// Xóa loại phí
export const deleteFeeType = async (req, res) => {
  try {
    const deleted = await feeTypeServices.deleteFeeType(req.params.id);
    if (!deleted) return res.status(404).json({ error: true, message: 'FeeType not found' });
    res.status(200).json({ error: false, message: 'FeeType deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting fee type', error });
  }
};

