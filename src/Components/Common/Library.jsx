import React from "react";
import { motion } from "framer-motion";
import { FaRegLightbulb, FaMicrophone, FaBookOpen, FaBrain } from "react-icons/fa";

const features = [
  {
    icon: <FaMicrophone className="text-blue-500 text-3xl" />, 
    title: "AI-Powered Transcription", 
    description: "Convert YouTube videos into accurate transcripts effortlessly."
  },
  {
    icon: <FaBookOpen className="text-green-500 text-3xl" />, 
    title: "Smart Summarization", 
    description: "Get concise summaries of videos to save time and enhance learning."
  },
  {
    icon: <FaBrain className="text-purple-500 text-3xl" />, 
    title: "AI-Generated Quizzes", 
    description: "Test your understanding with auto-generated quizzes based on video content."
  },
  {
    icon: <FaRegLightbulb className="text-yellow-500 text-3xl" />, 
    title: "Personalized Learning Paths", 
    description: "AI recommends videos and resources tailored to your learning style."
  }
];

const AIYouTubeLibrary = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">AI-Powered YouTube Library</h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
        Experience the future of learning with AI-driven transcription, smart summaries, and personalized recommendations.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }} 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIYouTubeLibrary;
