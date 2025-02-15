import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  watchedVideos: [{ videoId: String, title: String, watchedAt: Date }],
  completedTopics: [{ topicId: String, topicName: String, completedAt: Date }],
  quizScores: [
    { topicId: String, score: Number, total: Number, takenAt: Date },
  ],
  strengths: [{ topicId: String, topicName: String, confidenceLevel: Number }],
  weaknesses: [
    { topicId: String, topicName: String, improvementNeeded: Boolean },
  ],
});

export default mongoose.model("UserProgress", userProgressSchema);
