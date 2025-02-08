import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold">NoteFlix AI</h2>
          <p className="mt-2 text-gray-400">Your AI-powered learning companion.</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <a href="#features" className="text-gray-400 hover:text-white">Features</a>
          <a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a>
          <a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a>
          <a href="#faq" className="text-gray-400 hover:text-white">FAQ</a>
        </div>

        {/* Newsletter & Socials */}
        <div>
          <h3 className="text-lg font-semibold">Stay Updated</h3>
          <div className="flex mt-2">
            <input
              type="email"
              placeholder="Your email"
              className="p-2 w-full rounded-l-md bg-gray-800 border border-gray-600 focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 px-4 py-2 rounded-r-md"
            >
              Subscribe
            </motion.button>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-5">
        &copy; {new Date().getFullYear()} NoteFlix AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
