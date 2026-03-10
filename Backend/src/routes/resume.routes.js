import express from "express";
import { analyzeResumeController } from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/analyze-resume", analyzeResumeController);

export default router;