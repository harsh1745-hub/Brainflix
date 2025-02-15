import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "googleapis";
import dotenv from "dotenv";
import { YoutubeTranscript } from "youtube-transcript";

dotenv.config();

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, 
});
const GEMINI_API_KEY = process.env.API_KEY_GEMINI;
const genAi = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });




 
export const extractVideoId = (url) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
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
    const response = await model.generateContent(
      `Summarize this text:\n${text}`
    );
    return response.response?.text() || "Failed to generate summary.";
  } catch (error) {
    console.error("Summarization Error:", error.message || error);
    throw new Error("Failed to summarize text.");
  }
};


export const generateQuestions = async (text) => {
  if (!text) throw new Error("Text is required for question generation.");

  try {
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const response = await model.generateContent(
      `Generate 10 questions and answers from this text:\n${text}`
    );

    
    const output = response.response.candidates[0].content.parts
      .map((part) => part.text)
      .join("\n");

    console.log("AI Output:", output); 

    return output
      .split("\n")
      .map((line) => {
        const match = line.match(/(.+?)\?\s*(.+)/);
        return match ? { question: match[1] + "?", answer: match[2] } : null;
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Question Generation Error:", error.message || error);
    throw new Error("Failed to generate questions.");
  }
};

export const processYouTubeVideo = async (url) => {
  try {
    console.log("Received YouTube URL:", url); 

    if (!url || typeof url !== "string") {
      console.error("Invalid YouTube URL received:", url);
      throw new Error("Invalid YouTube URL. Please provide a valid URL.");
    }

    
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:.*v=|.*\/|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (!videoIdMatch) {
      throw new Error("Invalid YouTube URL format.");
    }

    const videoId = videoIdMatch[1]; 
    const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;

    console.log("Normalized YouTube URL:", normalizedUrl);

    const transcript = await fetchVideoTranscript(normalizedUrl);
    if (!transcript) {
      throw new Error("Transcript not available for this video.");
    }

    console.log("Transcript fetched successfully!");

    const summary = await summarizeText(transcript);
    const questions = await generateQuestions(transcript);

    return { summary, questions };
  } catch (error) {
    console.error("YouTube Video Processing Error:", error.message || error);
    throw new Error("Failed to process YouTube video.");
  }
};

export const recommendVideos = async (videoId) => {
  try {
    const response = await youtube.search.list({
      part: "snippet",
      relatedToVideoId: videoId,
      type: "video",
      maxResults: 5,
    });

    return response.data.items.map((video) => ({
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error("Failed to fetch recommended videos.");
  }
};
