import React, { useState } from "react";
import { FaSearch, FaPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const AIVideoProcessing = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");

  const handleProcessVideo = async () => {
    if (!videoUrl) return alert("Please enter a YouTube video URL");
    setProcessing(true);

    try {
      const response = await fetch("http://localhost:5000/video/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl }),
      });
      
      const data = await response.json();
      setTranscription(data.transcription);
      setSummary(data.summary);
    } catch (error) {
      console.error("Error processing video:", error);
    }
    
    setProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-center">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
        AI-Powered Video Processing
      </h2>
      <p className="text-gray-500 dark:text-gray-300 text-lg mb-8">
        Upload a YouTube video link to generate AI-driven transcription and summaries.
      </p>
      
      {/* Video Input */}
      <div className="flex items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Paste YouTube video link..."
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md flex-1 text-gray-800 dark:text-white bg-transparent focus:outline-none"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button
          onClick={handleProcessVideo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md flex items-center ml-3 transition-all"
        >
          <FaPlayCircle className="mr-2" /> Process
        </button>
      </div>

      {/* Loading Indicator */}
      {processing && <p className="text-blue-500 mt-4 text-lg">Processing video... Please wait.</p>}

      {/* Transcription Output */}
      {transcription && (
        <motion.div 
          className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">AI Transcription</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{transcription}</p>
        </motion.div>
      )}

      {/* Summary Output */}
      {summary && (
        <motion.div 
          className="mt-6 bg-yellow-100 dark:bg-yellow-700 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">AI Summary</h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{summary}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AIVideoProcessing;

