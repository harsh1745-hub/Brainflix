import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    videoId: { type: String, ref: "Video", required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, default: "medium" },
    aiGeneratedExplanation: { type: String, default: "No explanation available" },
    userAttempts: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            selectedOption: String,
            isCorrect: Boolean,
            timestamp: { type: Date, default: Date.now },
        }
    ]
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
