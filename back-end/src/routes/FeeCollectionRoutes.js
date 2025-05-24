import express from 'express';
import * as feeCollectionController from '../controllers/FeeCollectionController.js';

const router = express.Router();

router.get('/get-all-collection', feeCollectionController.getAllFeeCollections);
router.get('/get-collection-by-id/:id', feeCollectionController.getFeeCollectionById);
router.post('/create-collection', feeCollectionController.createFeeCollection);
router.put('/update-collection/:id', feeCollectionController.updateFeeCollection);
router.delete('/delete-collection/:id', feeCollectionController.deleteFeeCollection);

export default router;