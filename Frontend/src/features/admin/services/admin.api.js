const API_URL = "http://localhost:3000/api/admin";

export const getUsers = async () => {

  const res = await fetch(`${API_URL}/users`, {
    credentials: "include"
  });

  return res.json();
};

export const deleteUser = async (id) => {

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  return res.json();
};