import React, { useEffect, useState } from "react";
import UsersTable from "../components/UsersTable";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalMessages: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchStats = async () => {
      try {

        const res = await fetch("http://localhost:3000/api/admin/stats", {
          credentials: "include"
        });

        const data = await res.json();

        setStats(data);

      } catch (error) {
        console.log("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

  }, []);

  if (loading) {
    return <h2 style={{padding:"40px"}}>Loading admin data...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>

        <div className="admin-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="admin-card">
          <h3>Resumes Analyzed</h3>
          <p>{stats.totalResumes}</p>
        </div>

        <div className="admin-card">
          <h3>Community Messages</h3>
          <p>{stats.totalMessages}</p>
        </div>

        <div className="admin-card">
          <h3>Active Users</h3>
          <p>0</p>
        </div>

      </div>

      <UsersTable />

    </div>
  );
}

export default AdminDashboard;