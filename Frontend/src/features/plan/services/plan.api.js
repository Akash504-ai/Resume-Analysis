import axios from "axios";

const API = "http://localhost:3000/api/plans";

export const createPlan = async (data) => {
  const res = await axios.post(API, data, { withCredentials: true });
  return res.data;
};

export const getPlans = async () => {
  const res = await axios.get(API, { withCredentials: true });
  return res.data;
};

export const getPlanById = async (planId) => {
  const res = await axios.get(`${API}/${planId}`, { withCredentials: true });
  return res.data;
};

export const toggleTask = async (planId, dayIndex, taskIndex) => {
  const res = await axios.patch(
    `${API}/${planId}/day/${dayIndex}/task/${taskIndex}`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

export const addTask = async (planId, dayIndex, text) => {
  const res = await axios.post(
    `${API}/${planId}/day/${dayIndex}`,
    { text },
    { withCredentials: true }
  );
  return res.data;
};

export const deleteTask = async (planId, dayIndex, taskIndex) => {
  const res = await axios.delete(
    `${API}/${planId}/day/${dayIndex}/task/${taskIndex}`,
    { withCredentials: true }
  );
  return res.data;
};