import Change from '../models/Change.js';

// Lấy tất cả thay đổi
export const getAllChanges = async () => {
  return await Change.findAll();
};

// Lấy thay đổi theo ID
export const getChangeById = async (id) => {
  return await Change.findByPk(id);
};

// Thêm thay đổi mới
export const createChange = async (data) => {
  return await Change.create(data);
};

// Cập nhật thay đổi
export const updateChange = async (id, data) => {
  const change = await Change.findByPk(id);
  if (!change) return null;
  await change.update(data);
  return change;
};

// Xóa thay đổi
export const deleteChange = async (id) => {
  const change = await Change.findByPk(id);
  if (!change) return null;
  await change.destroy();
  return true;
};