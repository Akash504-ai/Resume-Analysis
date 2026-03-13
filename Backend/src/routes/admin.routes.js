import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

import {
  getAdminStats,
  getAllUsers,
  deleteUser
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/stats", authMiddleware, isAdmin, getAdminStats);

router.get("/users", authMiddleware, isAdmin, getAllUsers);

router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

export default router;