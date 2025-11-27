import React, { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://backend:8081/api/orders/all", {
        headers: { "Authorization": `Bearer ${token}` }
    })

      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>
              Order #{order.id} - Total: ₹{order.totalAmount.toFixed(2)}
            </h3>
            <p>User ID: {order.userId}</p>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map(item => (
                <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={50}
                    style={{ marginRight: "10px", verticalAlign: "middle" }}
                  />
                  {item.name} x {item.quantity} = ₹
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
