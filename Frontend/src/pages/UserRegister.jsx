import React from "react";
import "../styles/theme.css"; // optional if you want only accent colors, safe to keep


const UserRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    

      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md">
        
        <h2 className="text-lg font-semibold mb-4">Create your account</h2>

        <form className="w-full" onSubmit={(e) => e.preventDefault()}>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Full name
            <input
              type="text"
              placeholder="John Doe"
              className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
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
          <a href="/user/login" style={{ color: "var(--accent)" }} className="font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
