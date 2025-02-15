import express from 'express'
import { getLeaderboard,updateXp,trackStreak } from '../Controllers/leaderboardController.js';

const router=express.Router();
router.get("/leaderboard", getLeaderboard);
router.post("/update-xp", updateXp);
router.post("/track-streak", trackStreak);


export default router