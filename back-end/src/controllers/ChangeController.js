import * as changeService from '../services/ChangeServices.js';

// Lấy tất cả thay đổi
export const getAllChanges = async (req, res) => {
  try {
    const changes = await changeService.getAllChanges();
    res.status(200).json({ error: false, changes });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving changes', error });
  }
};

// Lấy thay đổi theo ID
export const getChangeById = async (req, res) => {
  try {
    const change = await changeService.getChangeById(req.params.id);
    if (!change) return res.status(404).json({ error: true, message: 'Change not found' });
    res.status(200).json({ error: false, change });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving change', error });
  }
};

// Thêm thay đổi mới
export const createChange = async (req, res) => {
  try {
    const { ResidentId, ChangeType, ChangeDate, Description } = req.body;
    if (!ResidentId || !ChangeType || !ChangeDate) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    const newChange = await changeService.createChange({ ResidentId, ChangeType, ChangeDate, Description });
    res.status(201).json({ error: false, change: newChange });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating change', error });
  }
};

// Cập nhật thay đổi
export const updateChange = async (req, res) => {
  try {
    const updated = await changeService.updateChange(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: true, message: 'Change not found' });
    res.status(200).json({ error: false, change: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating change', error });
  }
};

// Xóa thay đổi
export const deleteChange = async (req, res) => {
  try {
    const deleted = await changeService.deleteChange(req.params.id);
    if (!deleted) return res.status(404).json({ error: true, message: 'Change not found' });
    res.status(200).json({ error: false, message: 'Change deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting change', error });
  }
};