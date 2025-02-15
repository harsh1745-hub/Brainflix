import express from "express";
import { askQuestion } from "../Controllers/discussionController.js";

const router = express.Router();

router.post("/ask", askQuestion);

export default router;
