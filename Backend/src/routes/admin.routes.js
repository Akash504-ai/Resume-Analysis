import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";
import { getAllUsers, deleteUser } from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

export default router;