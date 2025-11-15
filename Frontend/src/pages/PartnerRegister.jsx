import React from 'react'
import '../styles/theme.css'


const PartnerRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Partner Sign up</h2>
        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Business name
            <input className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100" type="text" placeholder="Example Bites" />
          </label>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Contact name
            <input className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100" type="text" placeholder="Full name" />
          </label>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Email
            <input className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100" type="email" placeholder="partner@example.com" />
          </label>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Password
            <input className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100" type="password" placeholder="••••••••" />
          </label>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Phone number
            <input className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100" type="tel" placeholder="(+1) 555-555-555" />
          </label>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
            Address
            <input className="sh-input mt-1 block w-full h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100" type="text" placeholder="123 Main St, City, State ZIP" />
          </label>
          <button className="w-full rounded-lg py-3 mt-3 font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}>Create partner account</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">Already registered? <a href="/food-partner/login" style={{ color: 'var(--accent)' }}>Sign in</a></p>
      </div>
    </div>
  )
}

export default PartnerRegister
