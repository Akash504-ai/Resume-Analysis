import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import planController from "../controllers/plan.controller.js";

const planRouter = express.Router();

/**
 * @route POST /api/plans
 */
planRouter.post(
  "/",
  authMiddleware,
  planController.createPlanController
);

/**
 * @route GET /api/plans
 */
planRouter.get(
  "/",
  authMiddleware,
  planController.getUserPlansController
);

/**
 * @route GET /api/plans/:planId
 */
planRouter.get(
  "/:planId",
  authMiddleware,
  planController.getPlanByIdController
);

/**
 * @route PATCH /api/plans/:planId/day/:dayIndex/task/:taskIndex
 */
planRouter.patch(
  "/:planId/day/:dayIndex/task/:taskIndex",
  authMiddleware,
  planController.toggleTaskController
);

/**
 * @route POST /api/plans/:planId/day/:dayIndex
 */
planRouter.post(
  "/:planId/day/:dayIndex",
  authMiddleware,
  planController.addTaskController
);

/**
 * @route DELETE /api/plans/:planId/day/:dayIndex/task/:taskIndex
 */
planRouter.delete(
  "/:planId/day/:dayIndex/task/:taskIndex",
  authMiddleware,
  planController.deleteTaskController
);

export default planRouter;