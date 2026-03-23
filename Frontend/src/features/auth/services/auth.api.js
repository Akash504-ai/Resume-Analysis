import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/* =========================
   🔥 ADD INTERCEPTOR HERE
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   REGISTER
========================= */
export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err.response?.data || err);
    throw err;
  }
}

/* =========================
   LOGIN
========================= */
export const login = async ({ email, password }) => {
  try {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });

    // ✅ STORE TOKEN
    localStorage.setItem("token", res.data.token);

    return res.data;
  } catch (err) {
    console.log(err.response?.data || err);
    throw err;
  }
};

/* =========================
   LOGOUT
========================= */
export async function logout() {
  try {
    const response = await api.post("/api/auth/logout");

    // ✅ CLEAR TOKEN
    localStorage.removeItem("token");

    return response.data;
  } catch (err) {
    console.log(err.response?.data || err);
  }
}

/* =========================
   GET CURRENT USER
========================= */
export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");

    return response.data;
  } catch (err) {
    if (err.response?.status !== 401) {
      console.log(err.response?.data || err);
    }
    return null;
  }
}