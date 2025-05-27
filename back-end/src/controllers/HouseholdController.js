import * as householdService from '../services/HouseholdServices.js';

// Lấy tất cả hộ gia đình
export const getAllHouseholds = async (req, res) => {
  try {
    const households = await householdService.getAllHouseholds();
    res.status(200).json({error: false, households});
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error retrieving households', error });
  }
};

// Lấy hộ gia đình theo ID
export const getHouseholdById = async (req, res) => {
  try {
    const household = await householdService.getHouseholdById(req.params.id);
    if (!household) return res.status(404).json({  error: true, message: 'Household not found' });
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ error: false, message: 'Error retrieving household', error });
  }
};

// Thêm hộ gia đình mới
export const createHousehold = async (req, res) => {
  try {
    const { RoomNumber, Type, HouseholdHead, Members, Notes } = req.body;
    if (!RoomNumber || !Type || !Members || !HouseholdHead) {
      return res.status(400).json({ message: 'RoomNumber, Type, HousehouseHead and Members are required' });
    }

    const newHousehold = await householdService.createHousehold({RoomNumber, Type, HouseholdHead, Members, Notes});
    res.status(201).json({ error: false, newHousehold} );
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error creating household', error });
  }
};

// Cập nhật thông tin hộ gia đình
export const updateHousehold = async (req, res) => {
  try {
    const updatedHousehold = await householdService.updateHousehold(req.params.id, req.body);
    if (!updatedHousehold) return res.status(404).json({ error: true, message: 'Household not found' });
    res.status(200).json({ error: false, message: "Update successfully", updatedHousehold });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error updating household', error });
  }
};

// Xóa hộ gia đình
export const deleteHousehold = async (req, res) => {
  try {
    const result = await householdService.deleteHousehold(req.params.id);
    if (!result) return res.status(404).json({ message: 'Household not found' });
    res.status(200).json({ error: false, message: 'Household deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error deleting household', error });
  }
};

// Tìm hộ gia đình theo số phòng
export const findHouseholdByRoomNumber = async (req, res) => {
  try {
    const roomNumber = req.body.roomNumber || req.query.roomNumber;
    if (!roomNumber) {
      return res.status(400).json({ error: true, message: 'roomNumber is required' });
    }
    const household = await householdService.findHouseholdByRoomNumber(roomNumber);
    if (!household)
      return res.status(404).json({ error: true, message: 'Household not found' });
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Error finding household', error });
  }
};

