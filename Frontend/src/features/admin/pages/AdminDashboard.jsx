import React from "react";

function AdminDashboard() {

  return (
    <div style={{padding:"40px"}}>

      <h1>Admin Dashboard</h1>

      <div style={{display:"flex", gap:"20px", marginTop:"30px"}}>

        <div className="admin-card">
          <h3>Total Users</h3>
          <p>0</p>
        </div>

        <div className="admin-card">
          <h3>Resumes Analyzed</h3>
          <p>0</p>
        </div>

        <div className="admin-card">
          <h3>Community Messages</h3>
          <p>0</p>
        </div>

        <div className="admin-card">
          <h3>Active Users</h3>
          <p>0</p>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;