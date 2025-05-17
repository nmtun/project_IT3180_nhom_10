import express from 'express';
import * as vehicleController from '../controllers/VehicleController.js';

const router = express.Router();

router.get('/get-all-vehicle', vehicleController.getAllVehicles);
router.get('/get-vehicle-by-id/:id', vehicleController.getVehicleById);
router.post('/create-vehicle/', vehicleController.createVehicle);
router.put('/update-vehicle/:id', vehicleController.updateVehicle);
router.delete('/delete-vehicle/:id', vehicleController.deleteVehicle);

export default router;