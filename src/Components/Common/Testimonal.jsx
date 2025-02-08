import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Software Engineer",
    feedback: "NoteFlix AI has revolutionized my learning experience! The AI-generated summaries save me hours of study time.",
    rating: 5,
  
  },
  {
    name: "Mark Rivera",
    role: "Data Scientist",
    feedback: "I love the AI-powered quizzes! They help me retain knowledge much faster than traditional methods.",
    rating: 5,
    
  },
  {
    name: "Sophia Chen",
    role: "Student",
    feedback: "The automated note-taking feature is a game-changer! It makes my study sessions much more effective.",
    rating: 4,
    
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-900 text-center">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        What Our Users Say
      </h2>
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <img
          
          alt={testimonials[index].name}
          className="w-20 h-20 rounded-full mb-4 border-2 border-gray-300"
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {testimonials[index].name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonials[index].role}</p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">“{testimonials[index].feedback}”</p>
        <div className="flex mt-3">
          {[...Array(testimonials[index].rating)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400 text-lg" />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
