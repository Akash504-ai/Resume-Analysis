const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

/* --- GET ALL USERS --- */
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};

/* --- DELETE USER --- */
export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
};

/* --- TOGGLE BAN USER --- */
export const toggleBanUser = async (id) => {
  const res = await fetch(`${API_URL}/users/ban/${id}`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update user status");
  }

  return res.json();
};