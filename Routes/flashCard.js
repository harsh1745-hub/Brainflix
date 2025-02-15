import express from "express";
import { generateFlashcards } from "../API/aiservice.js";

const router = express.Router();

router.post("/genrate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required." });

    const flashcards = await generateFlashcards(text);
    res.json({ flashcards });
  } catch (error) {
    console.error("Flashcard API Error:", error);
    res.status(500).json({ message: "Error generating flashcards." });
  }
});

export default router;
