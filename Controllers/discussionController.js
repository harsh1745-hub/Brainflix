import Discussion from "../Models/discussion.js";
import {
  generateAiResponse,
  fetchVideoTranscript,
  generateLiveNotes,
} from "../API/aiservice.js";

export const askQuestion = async (req, res) => {
  try {
    const { question, videoUrl, userId } = req.body;
    if (!question || !videoUrl || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const videoTranscript = await fetchVideoTranscript(videoUrl);
    if (!videoTranscript) {
      return res
        .status(500)
        .json({ error: "Failed to fetch video transcript." });
    }

   
    const notes = await generateLiveNotes(videoTranscript);
    if (!notes) {
      return res.status(500).json({ error: "Failed to generate live notes." });
    }

    const aiResponse = await generateAiResponse(
      question,
      videoTranscript,
      notes
    );
    if (!aiResponse) {
      return res
        .status(500)
        .json({ error: "AI failed to generate a response." });
    }

    const newDiscussion = await Discussion.create({
      videoId: videoUrl,
      question,
      aiResponse,
      userId,
    });

    return res.status(201).json(newDiscussion);
  } catch (error) {
    console.error("Discussion Question Error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
