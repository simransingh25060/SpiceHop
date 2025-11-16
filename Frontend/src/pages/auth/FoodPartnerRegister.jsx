import React from "react";
import "../../styles/theme.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodPartnerRegister = () => {
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;  
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    axios.post("http://localhost:3000/api/auth/food-partner/register", {
      name: businessName,
      contactName,
      phone,
      email,
      password,
      address
            }, {
              withCredentials: true})
            .then(response => {
            console.log(response.data);      
            navigate("/create-food"); 

            })
            .catch(error => {
              console.error("There was an error registering!");
            });
        
          };
    

  return (
    <div className="auth-page-wrapper min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <div className="auth auth-card bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md">

        <header className="mb-4">
          <h2 className="text-lg font-semibold">Partner Sign up</h2>
        </header>

        <form className="w-full" onSubmit={handleSubmit}>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Business name
            <input
              id="businessName"
              name="businessName"
              type="text"
              placeholder="Example Bites"
              className="businessName sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Contact name
            <input
              id="contactName"
              name="contactName"
              type="text"
              placeholder="Full name"
              className="contactName sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Phone
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(+1) 555-555-555"
              className="phone sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Email
            <input
              id="email"
              name="email"
              type="email"
              placeholder="partner@example.com"
              className="email sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Password
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="password sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Address
            <input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main St, City, State ZIP"
              className="address sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </label>

          <button
            className="w-full rounded-lg py-3 mt-3 font-semibold"
            style={{
              background: "var(--accent)",
              color: "var(--accent-contrast)",
            }}
          >
            Create partner account
          </button>
        </form>

        {/* SIGN IN OPTION BELOW */}
        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/food-partner/login"
            className="font-medium"
            style={{ color: "var(--accent)" }}
          >
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
};

export default FoodPartnerRegister;
