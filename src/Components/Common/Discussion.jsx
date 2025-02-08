import React, { useState } from "react";
import { motion } from "framer-motion";

const QuizSection = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  const handleGenerateQuiz = async () => {
    const extractedId = extractVideoId(videoUrl);
    if (!extractedId) return alert("Invalid YouTube URL");
    setVideoId(extractedId);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/quiz/generate", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: extractedId }),
      });
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        Object.entries(selectedAnswers).map(async ([quizId, selectedOption]) => {
          const response = await fetch("http://localhost:5000/quiz/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizId, userId: "12345", selectedOption }),
          });
          return response.json();
        })
      );

      const feedbackData = results.reduce((acc, result, index) => {
        acc[quiz[index]._id] = result;
        return acc;
      }, {});

      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Quiz Generator</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Paste a YouTube URL to generate a quiz.</p>
      
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Paste YouTube URL..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button onClick={handleGenerateQuiz} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Generate Quiz
        </button>
      </div>

      {loading && <p>Loading quiz...</p>}
      
      {quiz.length > 0 && (
        <div className="space-y-6">
          {quiz.map((q, index) => (
            <motion.div
              key={q._id}
              className={`p-4 rounded-md shadow ${
                feedback[q._id]?.isCorrect
                  ? "bg-green-100 dark:bg-green-800"
                  : feedback[q._id] ? "bg-red-100 dark:bg-red-800"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-800 dark:text-white font-medium">
                {index + 1}. {q.question}
              </p>
              <div className="mt-2 space-y-2">
                {q.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={option}
                      checked={selectedAnswers[q._id] === option}
                      onChange={() => handleAnswerSelect(q._id, option)}
                      disabled={!!feedback[q._id]}
                    />
                    <label
                      className={`text-gray-700 dark:text-gray-300 ${
                        feedback[q._id]?.correctAnswer === option ? "font-bold" : ""
                      }`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              {feedback[q._id] && (
                <p className="mt-2 text-sm font-medium">
                  {feedback[q._id].isCorrect
                    ? "✅ Correct!"
                    : `❌ Incorrect. Correct answer: ${feedback[q._id].correctAnswer}`}
                </p>
              )}
            </motion.div>
          ))}
          <button
            onClick={handleSubmit}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-4 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSection;

