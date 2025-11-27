import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to ShopEase</h1>
        <p>Your one-stop shop for all your favorite products!</p>
        <div className="landing-buttons">
          <Link to="/signup" className="btn-primary">Create Account</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </header>

      <section className="landing-features">
        <h2>Why Shop with Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Wide Product Range</h3>
            <p>Explore a variety of products across multiple categories.</p>
          </div>
          <div className="feature-card">
            <h3>Exclusive Discounts</h3>
            <p>Get the best deals and offers available only for registered users.</p>
          </div>
          <div className="feature-card">
            <h3>Fast Checkout</h3>
            <p>Easy and secure checkout process with multiple payment options.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
