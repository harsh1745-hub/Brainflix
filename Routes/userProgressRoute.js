import express from 'express'
import { saveQuiz,completedTopics,saved,fetchUserProgress } from "../Controllers/userProgressController.js";
import { analyzeUserPerformance } from '../API/aiservice.js';

const router=express.Router();

router.post('/completed-topics',completedTopics);
router.post('/quiz-score',saveQuiz);
router.post('/watched-videos',saved);
router.get('/:userId',fetchUserProgress);
router.get("/:userIds", async (req, res) => {
    try {
      const analysis = await analyzeUserPerformance(req.params.userId);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to analyze user performance." });
    }
  });


export default router;