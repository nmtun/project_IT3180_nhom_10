import express from 'express';
import * as householdController from '../controllers/HouseholdController.js';

const router = express.Router();

router.get('/get-all-households', householdController.getAllHouseholds);
router.get('/get-household-by-id/:id', householdController.getHouseholdById);
router.post('/create-household', householdController.createHousehold);
router.put('/update-household/:id', householdController.updateHousehold);
router.delete('/delete-household/:id', householdController.deleteHousehold);
router.post('/find-household-by-room-number', householdController.findHouseholdByRoomNumber);

export default router;