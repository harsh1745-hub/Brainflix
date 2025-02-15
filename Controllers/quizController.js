import mongoose from "mongoose";
import Quiz from "../Models/QuizModel.js";
import User from "../Models/userModel.js";
import {
  fetchVideoTranscript,
  generateQuizFromYouTube,
} from "../API/aiservice.js";

export const generateQuiz = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ message: "YouTube URL is required." });
    }

    console.log("Generating quiz for video:", youtubeUrl);

    const videoIdMatch = youtubeUrl.match(
      /(?:v=|\/embed\/|\/watch\?v=|\/youtu\.be\/|\/v\/|\/e\/|watch\?.+&v=)([^&]+)/
    );
    if (!videoIdMatch || !videoIdMatch[1]) {
      return res.status(400).json({ message: "Invalid YouTube URL format." });
    }
    const videoId = videoIdMatch[1];

    console.log("Extracted videoId:", videoId);

    const quizQuestions = await generateQuizFromYouTube(youtubeUrl);

    if (!quizQuestions || quizQuestions.length === 0) {
      return res
        .status(500)
        .json({ message: "Quiz generation failed. AI returned no questions." });
    }

    const savedQuizzes = await Quiz.insertMany(
      quizQuestions.map((q) => ({
        videoId,
        videoUrl: youtubeUrl,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        aiGeneratedExplanation: q.explanation || "No explanation available.",
      }))
    );

    console.log("Quiz saved successfully.");
    return res.status(201).json(savedQuizzes);
  } catch (error) {
    console.error("Error in generateQuiz:", error);
    return res
      .status(500)
      .json({ message: "Error generating quiz", error: error.message });
  }
};

export const getQuizzesByVideo = async (req, res) => {
  try {
    const { videoUrl } = req.query;

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL is required." });
    }

    console.log("Fetching quizzes for video:", videoUrl);

    const quizzes = await Quiz.find({ videoUrl }).lean();

    if (!quizzes.length) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this video." });
    }

    return res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error in getQuizzesByVideo:", error);
    return res
      .status(500)
      .json({ message: "Error fetching quizzes", error: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    console.log("🔹 Received request at /quiz/submit");
    console.log("📩 Request Body:", req.body);

    const { quizId, userId, selectedOption } = req.body;

    if (!quizId || !userId || !selectedOption) {
      console.log("❌ Missing fields:", { quizId, userId, selectedOption });
      return res
        .status(400)
        .json({ message: "quizId, userId, and selectedOption are required." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(quizId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      console.log("❌ Invalid ObjectId format:", { quizId, userId });
      return res
        .status(400)
        .json({ message: "Invalid quizId or userId format." });
    }

    const [quiz, user] = await Promise.all([
      Quiz.findById(quizId).lean(),
      User.findById(userId),
    ]);

    if (!quiz) {
      console.log("❌ Quiz not found:", quizId);
      return res.status(404).json({ message: "Quiz not found." });
    }
    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ message: "User not found." });
    }

    const isCorrect = quiz.correctAnswer === selectedOption;

    const existingAttempt = user.quizAttempts?.find((attempt) =>
      attempt.quizId.equals(quizId)
    );

    if (existingAttempt) {
      console.log("⚠️ User has already attempted this quiz:", quizId);
      return res
        .status(400)
        .json({ message: "You have already attempted this quiz." });
    }

    const attempt = {
      quizId,
      selectedOption,
      isCorrect,
      explanation: quiz.aiGeneratedExplanation || "No explanation available",
      timestamp: new Date(),
    };

    user.quizAttempts = user.quizAttempts || [];
    user.quizAttempts.push(attempt);
    await user.save();

    console.log(`✅ Answer submitted: ${isCorrect ? "Correct" : "Incorrect"}`);

    return res.status(200).json({
      message: "Answer submitted successfully",
      attempt,
    });
  } catch (error) {
    console.error("❌ Error in submitAnswer:", error);
    return res
      .status(500)
      .json({ message: "Error submitting answer", error: error.message });
  }
};
