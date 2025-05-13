import User from "../models/User.js";

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const updateUser = async (id, updateData) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(updateData);
  return user;
}; 

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
}; 

export const findUserByUsername = async (username) => {
  return await User.findOne({ where: { Username: username } });
}; 

