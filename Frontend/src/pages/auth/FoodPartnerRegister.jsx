import React from "react";
import "../../styles/user-profile.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const businessName = e.target.businessName.value;
      const contactName = e.target.contactName.value;
      const phone = e.target.phone.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const address = e.target.address.value;

      const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
        name: businessName,
        contactName,
        phone,
        email,
        password,
        address
      }, {
        withCredentials: true
      });
      console.log(response.data);
      navigate("/partner-profile");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };
    

  return (
    <div className="reels-page">
      <div className="phone-frame">
        <header className="phone-header">
          <div className="header-content">
            <h1 className="brand-name">Partner Sign Up</h1>
          </div>
        </header>

        <main className="phone-main">
          <div className="user-auth-form-container">
            <form className="user-auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-header">
                <h2>Create partner account</h2>
                <p>Join SpiceHop as a food partner</p>
              </div>

              <div className="form-group">
                <label htmlFor="businessName">Business name</label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Example Bites"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactName">Contact name</label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(+1) 555-555-555"
                  required
                />
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

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Main St, City, State ZIP"
                  required
                />
              </div>

              <button type="submit" className="user-btn user-btn-primary">
                Create Partner Account
              </button>

              <p className="auth-switch-text">
                Already have an account?{" "}
                <a href="/food-partner/login" className="auth-switch-btn">
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;