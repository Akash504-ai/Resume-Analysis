import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import interviewController from "../controllers/interview.controller.js";
import upload from "../middlewares/file.middleware.js";

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report
 * @access private
 */
interviewRouter.post(
  "/",
  authMiddleware,
  upload.single("resume"),
  interviewController.generateInterViewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 */
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware,
  interviewController.getInterviewReportByIdController
);

/**
 * @route GET /api/interview/
 */
interviewRouter.get(
  "/",
  authMiddleware,
  interviewController.getAllInterviewReportsController
);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware,
  interviewController.generateResumePdfController
);

export default interviewRouter;