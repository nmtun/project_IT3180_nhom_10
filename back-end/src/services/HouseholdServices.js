import Household from "../models/Household.js";

//CRUD household
export const getAllHouseholds = async () => {
  return await Household.findAll();
};

export const getHouseholdById = async (id) => {
  return await Household.findByPk(id);
};

export const createHousehold = async (householdData) => {
  return await Household.create(householdData);
};

export const updateHousehold = async (id, updateData) => {
  const household = await Household.findByPk(id);
  if (!household) return null;
  await household.update(updateData);
  return household;
};

export const deleteHousehold = async (id) => {
  const household = await Household.findByPk(id);
  if (!household) return null;
  await household.destroy();
  return true;
};

export const findHouseholdByRoomNumber = async (roomNumber) => {
  return await Household.findOne({ where: { RoomNumber: roomNumber } });
};