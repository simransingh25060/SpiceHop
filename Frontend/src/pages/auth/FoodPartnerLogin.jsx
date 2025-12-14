import React from "react";
import "../../styles/user-profile.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;
  
      const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
        email,
        password,
      }, {
        withCredentials: true
      });
      console.log(response.data);
      navigate("/partner-profile");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="reels-page">
      <div className="phone-frame">
        <header className="phone-header">
          <div className="header-content">
            <h1 className="brand-name">Partner Sign In</h1>
          </div>
        </header>

        <main className="phone-main">
          <div className="user-auth-form-container">
            <form className="user-auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-header">
                <h2>Welcome back</h2>
                <p>Sign in to your partner account</p>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="partner@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="user-btn user-btn-primary">
                Sign In
              </button>

              <p className="auth-switch-text">
                Don't have an account?{" "}
                <a href="/food-partner/register" className="auth-switch-btn">
                  Create account
                </a>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;