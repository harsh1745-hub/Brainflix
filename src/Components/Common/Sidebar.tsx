import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Video, NotebookText, HelpCircle, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-black text-white h-screen p-4 transition-all duration-300 flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          className="mb-4 p-2 rounded bg-gray-800 hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar Links */}
        <nav className="flex flex-col gap-4">
          <SidebarItem Icon={Home} text="Home" isOpen={isOpen} to="/" />
          <SidebarItem Icon={Video} text="Videos" isOpen={isOpen} to="/videos" />
          <SidebarItem Icon={NotebookText} text="Notes" isOpen={isOpen} to="/notes" />
          <SidebarItem Icon={HelpCircle} text="Quizzes" isOpen={isOpen} to="/quizzes" />
        </nav>
      </div>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ Icon, text, isOpen, to }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-md transition"
  >
    <Icon size={24} />
    {isOpen && <span className="text-lg">{text}</span>}
  </Link>
);

export default Sidebar;

