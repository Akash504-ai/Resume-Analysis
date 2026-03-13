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
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading admin data...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>

      {/* HEADER */}

      <h1 style={{ marginBottom: "30px" }}>
        Admin Dashboard
      </h1>


      {/* STATS CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "50px"
        }}
      >

        <StatCard
          title="Total Users"
          value={stats.totalUsers}
        />

        <StatCard
          title="Resumes Analyzed"
          value={stats.totalResumes}
        />

        <StatCard
          title="Community Messages"
          value={stats.totalMessages}
        />

        <StatCard
          title="Active Users"
          value="0"
        />

      </div>


      {/* USER MANAGEMENT TABLE */}

      <UsersTable />

    </div>
  );
}


/* ---------------- STAT CARD COMPONENT ---------------- */

function StatCard({ title, value }) {

  return (
    <div
      style={{
        padding: "25px",
        borderRadius: "10px",
        background: "#f5f5f5",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >

      <h4 style={{ marginBottom: "10px" }}>
        {title}
      </h4>

      <h2>
        {value}
      </h2>

    </div>
  );

}

export default AdminDashboard;