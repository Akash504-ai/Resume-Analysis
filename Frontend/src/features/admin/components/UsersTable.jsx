import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, toggleBanUser } from "../services/admin.api";

function UsersTable() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const USERS_PER_PAGE = 5;

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.log("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleBan = async (id) => {
    await toggleBanUser(id);
    fetchUsers();
  };

  /* ---------- SEARCH FILTER ---------- */

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- PAGINATION ---------- */

  const startIndex = (page - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  return (
    <div style={{ marginTop: "60px" }}>

      <h2>User Management</h2>

      {/* SEARCH */}
      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          marginTop: "20px",
          padding: "8px",
          width: "250px"
        }}
      />

      {/* TABLE */}

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%" }}
      >

        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Banned</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {paginatedUsers.map((user) => (

            <tr key={user._id}>

              <td>{user.username}</td>

              <td>{user.email}</td>

              <td>{user.role}</td>

              <td>
                {user.isBanned ? "Yes" : "No"}
              </td>

              <td>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>

              <td style={{ display: "flex", gap: "10px" }}>

                {user.role !== "admin" && (
                  <>
                    <button
                      onClick={() => handleBan(user._id)}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* PAGINATION */}

      <div style={{ marginTop: "20px" }}>

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default UsersTable;