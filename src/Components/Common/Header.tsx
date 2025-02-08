import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState(3); // Dummy unread notifications
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user state
    }
  }, []);

  // Handle Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    setUser(null); // Update state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
      {/* Left: Brand Name & Sidebar Toggle (Mobile) */}
      <div className="flex items-center space-x-3">
        <button className="lg:hidden text-gray-700 dark:text-gray-200" onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <Link to="/" className="text-xl font-bold text-orange-500 dark:text-orange-400">
          BRAIN<span className="text-orange-500">FLIX</span>
        </Link>
      </div>

      {/* Center: Navigation Links (Only visible after login) */}
      {user && (
        <div className="hidden lg:flex space-x-6 text-gray-700 dark:text-gray-200">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <Link to="/notes" className="hover:text-orange-500">My Notes</Link>
          <Link to="/library" className="hover:text-orange-500">Library</Link>
          <Link to="/quiz" className="hover:text-orange-500">Quizzes</Link>
          <Link to='/ai' className="hover:text-orange-500">Services</Link>
        </div>
      )}

      {/* Right: Dark Mode, Notifications, Profile/Login */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode((prevMode) => !prevMode)}>
          {darkMode ? <FaSun size={20} className="text-yellow-400" /> : <FaMoon size={20} className="text-gray-600" />}
        </button>


        {/* Notifications */}
        <div className="relative">
          <FaBell size={22} className="text-gray-600 dark:text-gray-300" />
          {notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              {notifications}
            </span>
          )}
        </div>

        {/* User Profile / Login-Logout */}
        {user ? (
          <div className="flex items-center space-x-3">
            <img src="/default-avatar.png" alt="Profile" className="w-8 h-8 rounded-full" />
            <span className="text-gray-700 dark:text-gray-300 font-medium"></span>
            <button onClick={handleLogout} className="text-red-500 dark:text-red-400">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login" className="text-blue-500 dark:text-blue-400">Login</Link>
            <Link to="/signup" className="text-blue-500 dark:text-blue-400">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;