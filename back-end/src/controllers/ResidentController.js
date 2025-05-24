import * as residentServices from '../services/ResidentServices.js';
//import Resident from '../models/Resident.js';

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
    const { HouseholdID, FullName, Sex, Relationship } = req.body;

    // Kiểm tra các trường bắt buộc theo model
    if (!HouseholdID || !FullName || !Sex || !Relationship) {
      return res.status(400).json({
        message: "HouseholdID, FullName, Sex và Relationship là bắt buộc."
      });
    }
    
    const newResident = await residentServices.createResident(req.body);

    return res.status(201).json(newResident);
  } catch (error) {
    console.error("Error creating resident:", error);
    return res.status(500).json({
      message: "Lỗi khi tạo cư dân",
      error: error.message
    });
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