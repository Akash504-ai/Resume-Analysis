import express from "express";
import { saveGrokApiKey } from "../controllers/settingsController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/save-grok-key", authMiddleware, saveGrokApiKey);

export default router;