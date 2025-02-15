import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import dotenv from "dotenv";
import { YoutubeTranscript } from "youtube-transcript";
import WebSocket from "ws";
import UserProgress from "../Models/userProgress.js";

dotenv.config();

const getTranscript = YoutubeTranscript.fetchTranscript;
const GEMINI_API_KEY = process.env.API_KEY_GEMINI;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_API_KEY,
});

const genAi = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

export const extractVideoId = (url) => {
  const match = url.match(
    /[?&]v=([0-9A-Za-z_-]{11})|youtu\.be\/([0-9A-Za-z_-]{11})/
  );
  return match ? match[1] || match[2] : null;
};

export const fetchVideoTranscript = async (url) => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL.");
  }

  console.log("Extracted videoId:", videoId);

  try {
    console.log("Fetching transcript for video:", videoId);
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      throw new Error("Transcript data is invalid or empty");
    }
    return transcript.map((item) => item.text).join(" ");
  } catch (error) {
    console.error("Transcript Fetching Error:", error);
    throw new Error("Failed to fetch video transcript.");
  }
};

export const summarizeText = async (text) => {
  if (!text) throw new Error("Text is required for summarization.");

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Summarize this transcript:\n${text}` }],
        },
      ],
    });
    return response.response?.text() || "Failed to generate summary.";
  } catch (error) {
    console.error("Summarization Error:", error);
    throw new Error("Failed to summarize text.");
  }
};

export const generateQuestions = async (text) => {
  if (!text) throw new Error("Text is required for question generation.");

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate 5 multiple-choice questions with correct answers based on this transcript:\n${text}`,
            },
          ],
        },
      ],
    });

    const output = response.response?.text() || "";
    return output
      .split("\n")
      .map((line) => {
        const match = line.match(/(.+?)\?\s*(.+)/);
        return match ? { question: match[1] + "?", answer: match[2] } : null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Question Generation Error:", error);
    throw new Error("Failed to generate questions.");
  }
};

export const fetchLiveTranscript = async (videoId, ws) => {
  try {
    console.log("Fetching live transcript for:", videoId);
    const transcriptChunks = await getTranscript(videoId);
    for (let i = 0; i < transcriptChunks.length; i += 5) {
      const chunk = transcriptChunks
        .slice(i, i + 5)
        .map((item) => item.text)
        .join(" ");
      const liveNote = await generateLiveNotes(chunk);
      ws.send(JSON.stringify({ note: liveNote }));
    }
  } catch (error) {
    console.error("Live Transcript Error:", error);
    ws.send(JSON.stringify({ error: "Failed to fetch live notes." }));
  }
};

/**
 * Generates live notes from transcript chunks.
 */
export const generateLiveNotes = async (text) => {
  if (!text) throw new Error("Text is required for live note generation.");

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate real-time notes from this transcript snippet:\n${text}`,
            },
          ],
        },
      ],
    });
    const notes = (await response.response?.text()) || "No notes available.";
    return notes;
  } catch (error) {
    console.error("Live Notes Generation Error:", error);
    throw new Error("Failed to generate live notes.");
  }
};

export const setupLiveNotesWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws) => {
    console.log("Client connected for live notes.");
    ws.on("message", async (message) => {
      const { videoId } = JSON.parse(message);
      await fetchLiveTranscript(videoId, ws);
    });
    ws.on("close", () => console.log("Client disconnected."));
  });
};

export const generateFlashcards = async (text) => {
  if (!text) throw new Error("Text is required for flashcard generation.");

  try {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate flashcards with key points from this transcript:\n${text}`,
            },
          ],
        },
      ],
    });

    if (!response || !response.response) {
      throw new Error("Invalid response from AI model.");
    }

    const flashcardsText = await response.response.text();

    if (!flashcardsText) {
      throw new Error("Failed to generate flashcards.");
    }

    return flashcardsText
      .split("\n")
      .map((card) => card.trim())
      .filter((c) => c);
  } catch (error) {
    console.error("Flashcard API Error:", error);
    throw new Error("Failed to generate flashcards.");
  }
};

export const analyzeUserPerformance = async (userId) => {
  try {
    const progress = await UserProgress.findOne({ userId });
    if (!progress || progress.quizScores.length === 0) {
      return { message: "No quiz data available for analysis." };
    }

    const scores = progress.quizScores;
    let strengths = [];
    let weaknesses = [];

    scores.forEach(({ topicId, score, total }) => {
      const confidenceLevel = (score / total) * 100;
      if (confidenceLevel >= 75) {
        strengths.push({ topicId, confidenceLevel });
      } else {
        weaknesses.push({ topicId, improvementNeeded: true });
      }
    });

    const aiResponse = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze the following data and give study recommendations:
        Strengths: ${JSON.stringify(strengths)}
        Weaknesses: ${JSON.stringify(weaknesses)}
      `,
            },
          ],
        },
      ],
    });

    const recommendations =
      (await aiResponse.response?.text()) || "No recommendations available.";

    await UserProgress.updateOne({ userId }, { strengths, weaknesses });

    return { strengths, weaknesses, recommendations };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze performance.");
  }
};
export const generateQuizFromYouTube = async (youtubeUrl) => {
  try {
    const transcript = await fetchVideoTranscript(youtubeUrl);

    if (!transcript) {
      throw new Error("Transcript is empty.");
    }

    console.log("Generating questions...");
    const truncatedTranscript = transcript.substring(0, 4000);

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate 5 multiple-choice questions in valid JSON format. Each question should have:
{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Correct option"
}
Transcript: ${truncatedTranscript}`,
            },
          ],
        },
      ],
    });

    if (!response || !response.response) {
      throw new Error("Invalid AI response.");
    }

    let output = await response.response.text();
    console.log("AI Raw Output:", output);

    try {
      output = output.replace(/```json|```/g, "").trim();
      const questions = JSON.parse(output);

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid AI response structure.");
      }

      return questions;
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError.message);
      throw new Error("AI returned an invalid JSON format.");
    }
  } catch (error) {
    console.error("Quiz Generation Error:", error.message);
    throw new Error("Failed to generate quiz.");
  }
};
export const generateAiResponse = async (question, transcript, notes) => {
  try {
    console.log("Generating AI response for:", question);
    console.log("Transcript:", transcript);
    console.log("Notes:", notes);

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Answer this question based on the transcript and notes:\n\nQuestion: ${question}\n\nTranscript: ${transcript}\n\nNotes: ${notes}`,
            },
          ],
        },
      ],
    });

    if (!response.response) {
      console.error("⚠️ AI Response is undefined!");
      return "AI response could not be generated.";
    }

    const textResponse = await response.response.text();
    console.log("AI Response Generated:", textResponse);
    return textResponse || "No response generated";
  } catch (error) {
    console.error("❌ AI Response Generation Error:", error);
    return "Error generating response";
  }
};
