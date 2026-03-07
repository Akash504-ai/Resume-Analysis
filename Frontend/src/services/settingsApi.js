import axios from "axios";

export const saveGrokApiKey = async (apiKey) => {
  const response = await axios.post(
    "http://localhost:3000/api/settings/save-grok-key",
    { apiKey },
    { withCredentials: true },
  );

  return response.data;
};
