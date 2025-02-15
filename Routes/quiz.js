import express from "express";
import { generateQuiz, getQuizzesByVideo, submitAnswer } from "../Controllers/quizController.js";

const router = express.Router();


router.post("/generate", generateQuiz);


router.get("/video/:videoId", getQuizzesByVideo);

router.post("/submit", submitAnswer);

export default router;
