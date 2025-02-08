import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaFileAlt, FaBrain, FaUserFriends, FaGamepad, FaCloud } from "react-icons/fa";

const features = [
  { icon: <FaBookOpen />, title: "AI-Powered Summarization", description: "Get concise AI-generated summaries of long videos for quick understanding." },
  { icon: <FaFileAlt />, title: "Smart Transcription", description: "Convert video/audio to text with real-time transcription and searchability." },
  { icon: <FaBrain />, title: "AI-Generated Quizzes", description: "Test your knowledge with AI-generated quizzes and flashcards." },
  { icon: <FaUserFriends />, title: "Collaborative Learning", description: "Share notes, discuss insights, and collaborate with peers." },
  { icon: <FaGamepad />, title: "Gamified Experience", description: "Earn rewards, track progress, and stay motivated." },
  { icon: <FaCloud />, title: "Cloud Sync", description: "Access your notes and materials from any device, anytime." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
};

const FeaturesTimeline = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-16">
          🚀 Why Choose <span className="text-orange-500">NoteFlix AI</span>?
        </h2>

        <motion.div 
          className="relative flex flex-col space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Timeline Connector */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-full"></div>

          {/* Timeline Items */}
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`relative flex items-center w-full max-w-3xl mx-auto ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              variants={itemVariants}
            >
              {/* Feature Icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-orange-500 to-red-500 shadow-lg w-12 h-12 flex items-center justify-center rounded-full z-20 border-4 border-white dark:border-gray-800">
                <span className="text-white text-xl">{feature.icon}</span>
              </div>

              {/* Feature Content */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 100 }}
                className={`w-1/2 p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg ${
                  index % 2 === 0 ? "ml-16" : "mr-16"
                }`}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesTimeline;

