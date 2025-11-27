import React from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  // Example stats
  const stats = [
    { title: "Total Orders", value: 120, color: "#4a90e2" }, // primary
    { title: "Total Users", value: 75, color: "#27ae60" },    // success
    { title: "Revenue ($)", value: 5400, color: "#4a90e2" }, // primary
    { title: "Pending Orders", value: 5, color: "#f2994a" }, // warning
  ];

  // Example recent orders
  const recentOrders = [
    { id: 101, user: "Alice", total: 120, status: "Delivered" },
    { id: 102, user: "Bob", total: 50, status: "Pending" },
    { id: 103, user: "Charlie", total: 220, status: "Delivered" },
    { id: 104, user: "David", total: 80, status: "Pending" },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </header>

      {/* Stats Cards */}
      <div className="stats-cards">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderTop: `4px solid ${stat.color}` }}
          >
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <section className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>{order.total}</td>
                <td className={order.status === "Delivered" ? "status-delivered" : "status-pending"}>
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
