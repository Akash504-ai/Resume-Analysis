import { useState } from "react";
import * as planAPI from "../services/plan.api";

export const usePlan = () => {
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const data = await planAPI.getPlans();
    setPlans(data.plans);
    setLoading(false);
  };

  const fetchPlanById = async (planId) => {
    setLoading(true);
    const data = await planAPI.getPlanById(planId);
    setPlan(data.plan);
    setLoading(false);
  };

  const createNewPlan = async (payload) => {
    const data = await planAPI.createPlan(payload);
    setPlans((prev) => [data.plan, ...prev]);
  };

  const toggleTask = async (planId, dayIndex, taskIndex) => {
    const data = await planAPI.toggleTask(planId, dayIndex, taskIndex);
    setPlan(data.plan);
  };

  const addTask = async (planId, dayIndex, text) => {
    const data = await planAPI.addTask(planId, dayIndex, text);
    setPlan(data.plan);
  };

  const deleteTask = async (planId, dayIndex, taskIndex) => {
    const data = await planAPI.deleteTask(planId, dayIndex, taskIndex);
    setPlan(data.plan);
  };

  return {
    plans,
    plan,
    loading,
    fetchPlans,
    fetchPlanById,
    createNewPlan,
    toggleTask,
    addTask,
    deleteTask
  };
};