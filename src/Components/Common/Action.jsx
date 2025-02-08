import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="bg-gray-900 text-white py-16 text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-4">Supercharge Your Learning with NoteFlix AI!</h2>
        <p className="text-lg mb-6">Start summarizing, note-taking, and organizing your study materials like never before.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition"
        >
          Get Started for Free
        </motion.button>
      </div>
    </section>
  );
};

export default CTASection;
