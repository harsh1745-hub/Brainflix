import express from "express";
import {
  generateLiveNotess,
  getLiveNotes,
} from "../Controllers/noteController.js";

const router = express.Router();

router.post("/generate", generateLiveNotess); 
router.get("/:videoId", getLiveNotes); 

export default router;
