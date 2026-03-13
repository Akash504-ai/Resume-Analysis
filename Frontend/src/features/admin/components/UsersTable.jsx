import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../services/admin.api";

function UsersTable() {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div style={{ marginTop: "50px" }}>

      <h2>User Management</h2>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>

        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>

              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>

              <td>
                {user.role !== "admin" && (
                  <button onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default UsersTable;