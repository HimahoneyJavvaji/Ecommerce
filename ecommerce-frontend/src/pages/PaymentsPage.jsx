import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentsPage.css";

export default function PaymentsPage({ cart, setCart, user }) {
  const navigate = useNavigate();

  // Charges
  const discount = 10;
  const taxRate = 0.07;
  const shipping = 5;

  // Calculate totals safely
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const totalAmount = parseFloat((subtotal + tax + shipping - discount).toFixed(2));

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to place an order.");
      return;
    }

    if (!cart || cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // Prepare order payload exactly as backend expects
    const orderItems = cart.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl || ""
    }));

    const orderData = {
      totalAmount,
      items: orderItems
    };

    console.log("Order payload:", JSON.stringify(orderData, null, 2));

    try {
      const res = await fetch("http://backend:8081/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData) // <-- only this, no extra characters
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to place order");
      }

      const savedOrder = await res.json();
      alert(`Payment of $${totalAmount.toFixed(2)} successful! Order #${savedOrder.id} placed.`);

      setCart([]); // clear cart
      navigate("/home");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order: " + err.message);
    }
  };

  return (
    <div className="payments-page">
      <header className="bill-header">
        <h2>Payment Summary</h2>
        {user && <p>Customer: {user.name}</p>}
      </header>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="bill-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="charges">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Discount: -${discount.toFixed(2)}</p>
            <p>Tax (7%): ${tax.toFixed(2)}</p>
            <p>Shipping: ${shipping.toFixed(2)}</p>
          </div>

          <h3 className="total-amount">Total: ${totalAmount.toFixed(2)}</h3>

          <button className="pay-btn" onClick={handlePayment}>
            Pay Now
          </button>
        </>
      )}

      <footer className="bill-footer">
        <p>Thank you for shopping with us!</p>
      </footer>
    </div>
  );
}
