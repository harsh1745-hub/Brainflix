import React from "react";
import { motion } from "framer-motion";

const ComparisonTable = () => {
  const features = [
    "AI-Powered Summarization",
    "Smart Note-Taking",
    "AI-Generated Quizzes",
    "Personalized Learning Paths",
    "Collaborative Note Sharing",
    "Gamification & Rewards",
    "Real-Time AI Assistance"
  ];

  const data = {
    "BRAINFLIX": [true, true, true, true, true, true, true],
    "Traditional Learning": [false, false, false, false, false, false, false],
    "Other AI Tools": [true, false, true, false, false, false, true]
  };

  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-900 p-10 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Why Choose NoteFlix AI?
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="p-4 text-left text-gray-700 dark:text-white">Features</th>
              {Object.keys(data).map((category, idx) => (
                <th key={idx} className="p-4 text-gray-700 dark:text-white">
                  {category}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-gray-300 dark:border-gray-700"
              >
                <td className="p-4 text-gray-700 dark:text-white font-medium">
                  {feature}
                </td>
                {Object.values(data).map((values, idx) => (
                  <td
                    key={idx}
                    className="p-4 text-center"
                  >
                    {values[index] ? (
                      <span className="text-green-500 font-bold text-xl">✔</span>
                    ) : (
                      <span className="text-red-500 font-bold text-xl">✘</span>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisonTable;
