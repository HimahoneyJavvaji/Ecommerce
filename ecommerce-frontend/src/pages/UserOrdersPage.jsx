import React, { useEffect, useState } from "react";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://backend:8081/api/orders/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include", // add this if your backend uses cookies
        });

        // Read response safely
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }

        if (!res.ok) {
          throw new Error(
            (data && data.error) ||
              `Request failed with status ${res.status}`
          );
        }

        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>
              Order #{order.id} - Total: ₹{order.totalAmount.toFixed(2)}
            </h3>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={50}
                      alt={item.name}
                      style={{
                        marginRight: "0.5rem",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
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
