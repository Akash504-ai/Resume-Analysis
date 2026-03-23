import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export const saveGrokApiKey = async (apiKey) => {
  const response = await axios.post(
    `${API}/api/settings/save-grok-key`,
    { apiKey },
    { withCredentials: true }
  );

  return response.data;
};