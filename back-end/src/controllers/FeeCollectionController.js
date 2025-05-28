import * as feeCollectionServices from '../services/FeeCollectionServices.js';


// Lấy tất cả đợt thu phí
export const getAllFeeCollections = async (req, res) => {
  try {
    const feeCollections = await feeCollectionServices.getAllFeeCollections();
    res.status(200).json({ error: false, feeCollections });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee collections', error });
  }
};

// Lấy đợt thu phí theo ID
export const getFeeCollectionById = async (req, res) => {
  try {
    const feeCollection = await feeCollectionServices.getFeeCollectionById(req.params.id);
    if (!feeCollection) return res.status(404).json({ error: true, message: 'FeeCollection not found' });
    res.status(200).json({ error: false, feeCollection });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving fee collection', error });
  }
};

// Thêm đợt thu phí mới
export const createFeeCollection = async (req, res) => {
  try {
    console.log(">>> req.body:", JSON.stringify(req.body));
    const { FeeTypeID, CollectionName, StartDate,EndDate, TotalAmount, Status, Notes } = req.body;
    if (!CollectionName || !StartDate || !Status) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    const newFeeCollection = await feeCollectionServices.createFeeCollection({ FeeTypeID, CollectionName, StartDate,EndDate, TotalAmount, Status, Notes });
    res.status(201).json({ error: false, feeCollection: newFeeCollection });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating fee collection', error });
  }
};

// Cập nhật đợt thu phí
export const updateFeeCollection = async (req, res) => {
  try {
    const updated = await feeCollectionServices.updateFeeCollection(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: true, message: 'FeeCollection not found' });
    res.status(200).json({ error: false, feeCollection: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating fee collection', error });
  }
};

// Xóa đợt thu phí
export const deleteFeeCollection = async (req, res) => {
  try {
    const deleted = await feeCollectionServices.deleteFeeCollection(req.params.id);
    if (!deleted) return res.status(404).json({ error: true, message: 'FeeCollection not found' });
    res.status(200).json({ error: false, message: 'FeeCollection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting fee collection', error });
  }
};