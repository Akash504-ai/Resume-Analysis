import planModel from "../models/plan.model.js";

/**
 * @description Create a new plan
 */
async function createPlanController(req, res) {
  try {
    const { title, days } = req.body;

    console.log("CREATE PLAN REQUEST:", { title, days, user: req.user?.id });

    const plan = await planModel.create({
      title,
      days,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (error) {
    console.error("CREATE PLAN ERROR:", error);

    res.status(500).json({
      message: "Error creating plan",
      error: error.message,
    });
  }
}

/**
 * @description Get all plans of logged in user
 */
async function getUserPlansController(req, res) {
  try {
    console.log("GET USER PLANS REQUEST FOR USER:", req.user?.id);

    const plans = await planModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Plans fetched successfully",
      plans,
    });
  } catch (error) {
    console.error("GET USER PLANS ERROR:", error);

    res.status(500).json({
      message: "Error fetching plans",
      error: error.message,
    });
  }
}

/**
 * @description Get plan by ID
 */
async function getPlanByIdController(req, res) {
  try {
    const { planId } = req.params;

    console.log("GET PLAN BY ID:", planId);

    const plan = await planModel.findOne({
      _id: planId,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    res.status(200).json({
      message: "Plan fetched successfully",
      plan,
    });
  } catch (error) {
    console.error("GET PLAN BY ID ERROR:", error);

    res.status(500).json({
      message: "Error fetching plan",
      error: error.message,
    });
  }
}

/**
 * @description Toggle task completion
 */
async function toggleTaskController(req, res) {
  try {
    const { planId, dayIndex, taskIndex } = req.params;

    console.log("TOGGLE TASK:", { planId, dayIndex, taskIndex });

    const plan = await planModel.findOne({
      _id: planId,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    const task = plan.days[dayIndex].tasks[taskIndex];

    task.completed = !task.completed;

    if (task.completed) {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await plan.save();

    await plan.save();

    res.status(200).json({
      message: "Task updated successfully",
      plan,
    });
  } catch (error) {
    console.error("TOGGLE TASK ERROR:", error);

    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
}

/**
 * @description Add new task to a day
 */
async function addTaskController(req, res) {
  try {
    const { planId, dayIndex } = req.params;
    const { text } = req.body;

    console.log("ADD TASK:", { planId, dayIndex, text });

    const plan = await planModel.findOne({
      _id: planId,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    plan.days[dayIndex].tasks.push({
      text,
      completed: false,
    });

    await plan.save();

    res.status(200).json({
      message: "Task added successfully",
      plan,
    });
  } catch (error) {
    console.error("ADD TASK ERROR:", error);

    res.status(500).json({
      message: "Error adding task",
      error: error.message,
    });
  }
}

/**
 * @description Delete task
 */
async function deleteTaskController(req, res) {
  try {
    const { planId, dayIndex, taskIndex } = req.params;

    console.log("DELETE TASK:", { planId, dayIndex, taskIndex });

    const plan = await planModel.findOne({
      _id: planId,
      user: req.user.id,
    });

    if (!plan) {
      return res.status(404).json({
        message: "Plan not found",
      });
    }

    plan.days[dayIndex].tasks.splice(taskIndex, 1);

    await plan.save();

    res.status(200).json({
      message: "Task deleted successfully",
      plan,
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
}

export default {
  createPlanController,
  getUserPlansController,
  getPlanByIdController,
  toggleTaskController,
  addTaskController,
  deleteTaskController,
};
