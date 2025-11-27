import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  const handleIncrease = (itemId) => {
    setCart(prev =>
      prev.map(ci =>
        ci.id === itemId ? { ...ci, quantity: ci.quantity + 1 } : ci
      )
    );
  };

  const handleDecrease = (itemId) => {
    setCart(prev =>
      prev
        .map(ci =>
          ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        )
        .filter(ci => ci.quantity > 0)
    );
  };

  const handleRemove = (itemId) => {
    setCart(prev => prev.filter(ci => ci.id !== itemId));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      className="decrease"
                      onClick={() => handleDecrease(item.id)}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button
                      className="increase"
                      onClick={() => handleIncrease(item.id)}
                    >
                      +
                    </button>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
          <button
            className="proceed-btn"
            onClick={() => navigate("/payment")}
          >
            Proceed to Pay
          </button>
        </>
      )}
    </div>
  );
}
