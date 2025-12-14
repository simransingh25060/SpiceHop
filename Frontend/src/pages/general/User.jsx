import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user-profile.css";
import BottomNav from "../../components/BottomNav";

const User = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to fetch user data to verify if logged in
      const response = await axios.get("http://localhost:3000/api/auth/user/me", {
        withCredentials: true,
      });
      
      if (response.data) {
        setIsLoggedIn(true);
        setUserData(response.data);
      }
    } catch (error) {
        console.log(error)
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/user/logout",
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserData(null);
      setShowAuthForm(false);
      localStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      const response = await axios.post(
        "http://localhost:3000/api/auth/user/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data);
      setShowAuthForm(false);
      checkAuthStatus();
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const firstName = e.target.firstName.value;
      const lastName = e.target.lastName.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      const response = await axios.post(
        "http://localhost:3000/api/auth/user/register",
        {
          fullName: firstName + " " + lastName,
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log(response.data);
      setShowAuthForm(false);
      checkAuthStatus();
    } catch (error) {
      console.error("Register error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="reels-page">
        <div className="phone-frame">
          <header className="phone-header">
            <h1>Account</h1>
          </header>
          <main className="phone-main">
            <div className="user-loading">
              <div className="spinner"></div>
            </div>
          </main>
          <BottomNav active="user" />
        </div>
      </div>
    );
  }

  // If not logged in, show login/signup options
  if (!isLoggedIn) {
    return (
      <div className="reels-page">
        <div className="phone-frame">
          <header className="phone-header">
            <div className="header-content">
              {showAuthForm && (
                <button
                  className="header-back-btn"
                  onClick={() => setShowAuthForm(false)}
                  aria-label="Go back"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
              )}
              <h1 className="brand-name">
                {showAuthForm ? (authMode === "login" ? "Sign In" : "Create Account") : "Account"}
              </h1>
            </div>
          </header>

          <main className="phone-main">
            {!showAuthForm ? (
              <div className="user-guest-container">
                <div className="user-welcome-section">
                  <div className="user-icon-large">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M3 21c0-4.4 3.6-8 8-9 4.4 1 8 4.6 8 9" />
                    </svg>
                  </div>
                  <h2 className="user-welcome-title">Welcome to SpiceHop</h2>
                  <p className="user-welcome-subtitle">
                    Discover amazing food recipes and connect with food lovers
                  </p>
                </div>

                <div className="user-auth-buttons">
                  <button
                    className="user-btn user-btn-primary"
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthForm(true);
                    }}
                  >
                    <span>Sign In</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    className="user-btn user-btn-secondary"
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuthForm(true);
                    }}
                  >
                    <span>Create Account</span>
                  </button>
                </div>

                <div className="user-divider">
                  <span>OR</span>
                </div>

                <div className="user-partner-section">
                  <div className="user-partner-card">
                    <div className="user-partner-icon">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                        <path d="M16 11l2 2 4-4" />
                      </svg>
                    </div>
                    <h3>Food Partner?</h3>
                    <p>Share your recipes and grow your audience</p>
                    <button
                      className="user-btn user-btn-outline"
                      onClick={() => navigate("/food-partner/login")}
                    >
                      Partner Login
                    </button>
                  </div>
                </div>

                <div className="user-features">
                  <div className="user-feature-item">
                    <span className="feature-icon">🎥</span>
                    <span className="feature-text">Watch food reels</span>
                  </div>
                  <div className="user-feature-item">
                    <span className="feature-icon">🔖</span>
                    <span className="feature-text">Save favorites</span>
                  </div>
                  <div className="user-feature-item">
                    <span className="feature-icon">❤️</span>
                    <span className="feature-text">Like & share</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="user-auth-form-container">
                {authMode === "login" ? (
                  <form className="user-auth-form" onSubmit={handleLogin}>
                    <div className="auth-form-header">
                      <h2>Welcome back</h2>
                      <p>Sign in to continue to SpiceHop</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
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
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => setAuthMode("register")}
                      >
                        Create account
                      </button>
                    </p>
                  </form>
                ) : (
                  <form className="user-auth-form" onSubmit={handleRegister}>
                    <div className="auth-form-header">
                      <h2>Create your account</h2>
                      <p>Join SpiceHop today</p>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First name</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName">Last name</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
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
                      Create Account
                    </button>

                    <p className="auth-switch-text">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() => setAuthMode("login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            )}
          </main>

          <BottomNav active="user" />
        </div>
      </div>
    );
  }

  // If logged in, show user profile
  return (
    <div className="reels-page">
      <div className="phone-frame">
        <header className="phone-header">
          <h1>Profile</h1>
        </header>

        <main className="phone-main">
          <div className="user-profile-container">
            <div className="user-profile-header">
              <div className="user-avatar">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M3 21c0-4.4 3.6-8 8-9 4.4 1 8 4.6 8 9" />
                </svg>
              </div>
              <h2 className="user-name">{userData?.name || "User"}</h2>
              <p className="user-email">{userData?.email}</p>
            </div>

            <div className="user-stats">
              <div className="user-stat-item">
                <span className="stat-value">{userData?.stats?.saved || 0}</span>
                <span className="stat-label">Saved</span>
              </div>
              <div className="user-stat-item">
                <span className="stat-value">{userData?.stats?.liked || 0}</span>
                <span className="stat-label">Liked</span>
              </div>
            </div>

            <div className="user-menu">
              <button className="user-menu-item">
                <span className="menu-icon">👤</span>
                <span className="menu-text">Edit Profile</span>
                <span className="menu-arrow">›</span>
              </button>

              <button className="user-menu-item">
                <span className="menu-icon">⚙️</span>
                <span className="menu-text">Settings</span>
                <span className="menu-arrow">›</span>
              </button>

              <button className="user-menu-item">
                <span className="menu-icon">🔔</span>
                <span className="menu-text">Notifications</span>
                <span className="menu-arrow">›</span>
              </button>

              <button className="user-menu-item">
                <span className="menu-icon">❓</span>
                <span className="menu-text">Help & Support</span>
                <span className="menu-arrow">›</span>
              </button>

              <button className="user-menu-item">
                <span className="menu-icon">ℹ️</span>
                <span className="menu-text">About SpiceHop</span>
                <span className="menu-arrow">›</span>
              </button>
            </div>

            <button className="user-btn user-btn-logout" onClick={handleLogout}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </main>

        <BottomNav active="user" />
      </div>
    </div>
  );
};

export default User;