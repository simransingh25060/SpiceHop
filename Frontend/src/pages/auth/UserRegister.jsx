import React from "react";
import "../../styles/theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await axios.post("http://localhost:3000/api/auth/user/register", {
      fullName: firstName + " " + lastName,
      email,
      password
    }, {
      withCredentials: true
    })

    console.log(response.data);

    navigate("/")
  };

  return (
    <div className="auth-page-wrapper min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <div className="auth auth-card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md">

        <header>
          <h2 className="register-title text-lg font-semibold mb-4">
            Create your account
          </h2>
        </header>

        <form className="w-full" onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
              First name
              <input
                id="first-name"
                name="firstName"
                type="text"
                placeholder="John"
                className="first-name sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
              />
            </label>

            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
              Last name
              <input
                id="last-name"
                name="lastName"
                type="text"
                placeholder="Doe"
                className="last-name sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
              />
            </label>
          </div>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2 mt-2">
            Email
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="email sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Password
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="password sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <button
            className="w-full rounded-lg py-3 mt-3 font-semibold"
            style={{
              background: "var(--accent)",
              color: "var(--accent-contrast)",
            }}
          >
            Create user account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/user/login"
            style={{ color: "var(--accent)" }}
            className="font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
