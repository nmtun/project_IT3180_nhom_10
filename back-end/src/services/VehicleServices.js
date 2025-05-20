import Vehicle from '../models/Vehicle.js';

// Lấy tất cả phương tiện
export const getAllVehicles = async () => {
  return await Vehicle.findAll();
};

// Lấy phương tiện theo ID
export const getVehicleById = async (id) => {
  return await Vehicle.findByPk(id);
};

// Thêm phương tiện mới
export const createVehicle = async (data) => {
  return await Vehicle.create(data);
};

// Cập nhật phương tiện
export const updateVehicle = async (id, data) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) return null;
  await vehicle.update(data);
  return vehicle;
};

// Xóa phương tiện
export const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) return null;
  await vehicle.destroy();
  return true;
};