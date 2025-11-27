import React from "react";
import "./UserDashboard.css";

export default function UserDashboard() {
  const stats = {
    orders: 12,
    discountsUsed: 5,
    totalSaved: "$230",
  };

  const coupons = [
    { id: 1, code: "SAVE20", desc: "20% off on electronics" },
    { id: 2, code: "FREESHIP", desc: "Free shipping on orders over $50" },
  ];

  const trending = [
    { id: 1, name: "Bluetooth Speaker", price: "$39.99" },
    { id: 2, name: "Running Shoes", price: "$75.00" },
    { id: 3, name: "Smartphone Case", price: "$15.00" },
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome */}
      <section className="dashboard-header">
        <h2>Hi</h2>
        <p>Here’s your shopping overview.</p>
      </section>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>{stats.orders}</h3>
          <p>Orders Placed</p>
        </div>
        <div className="stat-card">
          <h3>{stats.discountsUsed}</h3>
          <p>Discounts Used</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalSaved}</h3>
          <p>Total Saved</p>
        </div>
      </section>

      {/* Coupons */}
      <section className="dashboard-section">
        <h3>Your Active Coupons</h3>
        <ul className="coupon-list">
          {coupons.map(c => (
            <li key={c.id}>
              <span className="coupon-code">{c.code}</span>
              <span className="coupon-desc">{c.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Trending Products */}
      <section className="dashboard-section">
        <h3>Trending Now</h3>
        <div className="trending-grid">
          {trending.map(item => (
            <div key={item.id} className="trend-card">
              <h4>{item.name}</h4>
              <p>{item.price}</p>
              <button className="btn-primary">View</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
