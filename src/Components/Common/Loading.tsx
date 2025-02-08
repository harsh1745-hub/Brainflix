import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white px-6">
      <div className="max-w-5xl text-center space-y-6">
        
        {/* Animated Heading */}
        <motion.h1 
          className="text-5xl md:text-6xl font-extrabold"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Supercharge Your Learning with <span className="text-orange-500">BRAINFLIX AI</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-powered transcription, smart notes, and personalized learning paths—transforming the way you learn from YouTube videos.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 text-lg">
            Get Started
          </button>
          <button  className="border-white text-white px-6 py-3 text-lg">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
