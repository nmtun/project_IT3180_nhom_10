import expess from 'express';
import * as feeDetailController from '../controllers/FeeDetailController.js';

const router = expess.Router();

router.get('/get-all-fee-detail', feeDetailController.getAllFeeDetails); 
router.get('/get-fee-detail-by-id/:id', feeDetailController.getFeeDetailById);
router.post('/create-fee-detail/', feeDetailController.createFeeDetail);
router.put('/update-fee-detail/:id', feeDetailController.updateFeeDetail);
router.delete('/delete-fee-detail/:id', feeDetailController.deleteFeeDetail);

export default router;