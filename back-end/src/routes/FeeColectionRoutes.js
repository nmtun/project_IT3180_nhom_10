import express from 'express';
import * as feeColectionController from '../controllers/FeeColectionController.js';

const router = express.Router();

router.get('/get-all-colection', feeColectionController.getAllFeeColections);
router.get('/get-colection-by-id/:id', feeColectionController.getFeeColectionById);
router.post('/create-colection', feeColectionController.createFeeColection);
router.put('/update-colection/:id', feeColectionController.updateFeeColection);
router.delete('/delete-colection/:id', feeColectionController.deleteFeeColection);

export default router;