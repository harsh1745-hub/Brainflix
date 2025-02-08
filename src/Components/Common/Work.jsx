import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMicrophone, FaBookOpen, FaQuestion, FaBrain } from "react-icons/fa";

const steps = [
  { icon: <FaSearch />, title: "Search & Import Videos", desc: "Find and add YouTube videos easily." },
  { icon: <FaMicrophone />, title: "AI-Powered Transcription", desc: "Convert speech to text instantly." },
  { icon: <FaBookOpen />, title: "Smart Summarization", desc: "Get concise key points from videos." },
  { icon: <FaQuestion />, title: "Generate AI Quizzes", desc: "Test knowledge with AI-generated quizzes." },
  { icon: <FaBrain />, title: "Personalized Learning", desc: "AI suggests the best learning materials." }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 text-center">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">How It Works</h2>
      <div className="max-w-4xl mx-auto flex flex-col space-y-12">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex items-center space-x-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
          >
            <div className="text-4xl text-blue-500 dark:text-blue-400">{step.icon}</div>
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
