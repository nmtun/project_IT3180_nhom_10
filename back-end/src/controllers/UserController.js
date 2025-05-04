import * as userService from "../services/UserServices.js";

export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
  res.json(updatedUser);
};

export const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  if (!result) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};
