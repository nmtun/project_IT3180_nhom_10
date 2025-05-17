import express from "express";
import {
  getAllFeeTypes,
  getFeeTypeById,
  createFeeType,
  updateFeeType,
  deleteFeeType,
} from "../controllers/FeeTypeController.js";

const router = express.Router();

// Lấy tất cả các loại phí
router.get("/", getAllFeeTypes);

// Lấy một loại phí theo ID
router.get("/:id", getFeeTypeById);

// Tạo loại phí mới
router.post("/", createFeeType);

// Cập nhật loại phí
router.put("/:id", updateFeeType);

// Xóa loại phí
router.delete("/:id", deleteFeeType);

export default router;
