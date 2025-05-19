import express from 'express';
import * as changeController from '../controllers/ChangeController.js';

const router = express.Router();

router.get('/get-all-change', changeController.getAllChanges);
router.get('/get-change-by-id/:id', changeController.getChangeById);
router.post('/create-change', changeController.createChange);
router.put('/update-change/:id', changeController.updateChange);
router.delete('/delete-change/:id', changeController.deleteChange);

export default router;