import express from "express";
import {
  searchVideos,
  summarizeVideo,
  generateQuizFromVideo,
  recommendTopics,
  handleProcessYouTubeVideo,
} from "../Controllers/videoController.js"; 



const router = express.Router();

router.get("/search", searchVideos);
router.post("/summarize", summarizeVideo);
router.post("/quiz", generateQuizFromVideo);
router.post("/recommend",recommendTopics);
router.post('/process',handleProcessYouTubeVideo)

export default router;
