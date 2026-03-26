import React from "react";
import Button from "./Button.jsx";
import "../styles/Hero.css";

export default function Hero({ title, description, buttonText }) {
  return (
    <section className="hero-container">
      <div className="hero-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="hero-actions">
          <button className="hero-button hero-button--primary">
            {buttonText}
          </button>
          <button className="hero-button hero-button--secondary">
            Learn More
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
