import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import planController from "../controllers/plan.controller.js";

const planRouter = express.Router();

/**
 * @route POST /api/plans
 * @description Create a new plan
 * @access private
 */
planRouter.post(
  "/",
  authMiddleware.authUser,
  planController.createPlanController
);

/**
 * @route GET /api/plans
 * @description Get all plans of logged in user
 * @access private
 */
planRouter.get(
  "/",
  authMiddleware.authUser,
  planController.getUserPlansController
);

/**
 * @route GET /api/plans/:planId
 * @description Get a specific plan
 * @access private
 */
planRouter.get(
  "/:planId",
  authMiddleware.authUser,
  planController.getPlanByIdController
);

/**
 * @route PATCH /api/plans/:planId/day/:dayIndex/task/:taskIndex
 * @description Toggle task completion
 * @access private
 */
planRouter.patch(
  "/:planId/day/:dayIndex/task/:taskIndex",
  authMiddleware.authUser,
  planController.toggleTaskController
);

/**
 * @route POST /api/plans/:planId/day/:dayIndex
 * @description Add task to a day
 * @access private
 */
planRouter.post(
  "/:planId/day/:dayIndex",
  authMiddleware.authUser,
  planController.addTaskController
);

/**
 * @route DELETE /api/plans/:planId/day/:dayIndex/task/:taskIndex
 * @description Delete task
 * @access private
 */
planRouter.delete(
  "/:planId/day/:dayIndex/task/:taskIndex",
  authMiddleware.authUser,
  planController.deleteTaskController
);

export default planRouter;