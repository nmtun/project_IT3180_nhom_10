import express from "express";
import * as userController from "../controllers/UserController.js";

const router = express.Router();

router.get("/get-all-user", userController.getAllUsers);
router.get("/get-user-by-id/:id", userController.getUserById);
router.post("/create-user", userController.createUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);
router.post('/login', userController.login);

export default router;  
   