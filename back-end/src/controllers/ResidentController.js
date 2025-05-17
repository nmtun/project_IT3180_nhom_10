import * as residentServices from '../services/ResidentServices.js';

// Lấy tất cả cư dân
export const getAllResidents = async (req, res) => {
  try {
    const residents = await residentServices.getAllResidents();
    res.status(200).json({ error: false, residents });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving residents', error });
  }
};

// Lấy cư dân theo ID
export const getResidentById = async (req, res) => {
  try {
    const resident = await residentServices.getResidentById(req.params.id);
    if (!resident) return res.status(404).json({ error: true, message: 'Resident not found' });
    res.status(200).json({ error: false, resident });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving resident', error });
  }
};

// Thêm cư dân mới
export const createResident = async (req, res) => {
  try {
    const { FullName, DateOfBirth, Sex, Address, Phone, IdentityNumber } = req.body;
    if (!FullName || !DateOfBirth || !Sex) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }
    const newResident = await residentServices.createResident({ FullName, DateOfBirth, Sex, Address, Phone, IdentityNumber });
    res.status(201).json({ error: false, resident: newResident });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating resident', error });
  }
};

// Cập nhật cư dân
export const updateResident = async (req, res) => {
  try {
    const updated = await residentServices.updateResident(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: true, message: 'Resident not found' });
    res.status(200).json({ error: false, resident: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating resident', error });
  }
};

// Xóa cư dân
export const deleteResident = async (req, res) => {
  try {
    const deleted = await residentServices.deleteResident(req.params.id);
    if (!deleted) return res.status(404).json({ error: true, message: 'Resident not found' });
    res.status(200).json({ error: false, message: 'Resident deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting resident', error });
  }
};