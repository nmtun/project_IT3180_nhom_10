import express from "express";
import * as userController from "../controllers/UserController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", userController.login);

// Protected routes
router.get("/get-all-user", isAdmin, userController.getAllUsers);
router.get("/get-user-by-id/:id", isAdmin, userController.getUserById);
router.post("/create-user", isAdmin, userController.createUser);
router.put("/update-user/:id", isAdmin, userController.updateUser);
router.delete("/delete-user/:id", isAdmin, userController.deleteUser);

export default router;
