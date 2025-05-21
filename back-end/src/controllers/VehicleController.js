import * as vehicleService from "../services/VehicleServices.js";

// Lấy tất cả phương tiện
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json({ error: false, vehicles });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Error retrieving vehicles", error });
  }
};

// Lấy phương tiện theo ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle)
      return res
        .status(404)
        .json({ error: true, message: "Vehicle not found" });
    res.status(200).json({ error: false, vehicle });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Error retrieving vehicle", error });
  }
};

// Thêm phương tiện mới
export const createVehicle = async (req, res) => {
  try {
    const { HouseholdID, LicensePlate, VehicleType, RegistrationDate, Status, Brand, Color } =
      req.body;
    if (
      !HouseholdID ||
      !VehicleType ||
      !LicensePlate ||
      !RegistrationDate ||
      !Status ||
      !Brand ||
      !Color
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Missing required fields" });
    }
    const newVehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ error: false, vehicle: newVehicle });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: true,
        message: "Error creating vehicle",
        detail: error.message,
      });
  }
};

// Cập nhật phương tiện
export const updateVehicle = async (req, res) => {
  try {
    const updated = await vehicleService.updateVehicle(req.params.id, req.body);
    if (!updated)
      return res
        .status(404)
        .json({ error: true, message: "Vehicle not found" });
    res.status(200).json({ error: false, vehicle: updated });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Error updating vehicle", error });
  }
};

// Xóa phương tiện
export const deleteVehicle = async (req, res) => {
  try {
    const deleted = await vehicleService.deleteVehicle(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ error: true, message: "Vehicle not found" });
    res
      .status(200)
      .json({ error: false, message: "Vehicle deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Error deleting vehicle", error });
  }
};
