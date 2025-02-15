import axios from "axios";
import dotenv from "dotenv";
import { summarizeText, generateQuestions, } from "../API/aiservice.js";
import { extractVideoId,processYouTubeVideo,recommendVideos } from "../API/youtube.js";
import Video from "../Models/videoModel.js";

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
    console.error("Missing YOUTUBE_API_KEY in environment variables.");
    process.exit(1);
}

export const searchVideos = async (req, res) => {
    const { query, maxResults = 5 } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Query parameter or YouTube URL is required" });
    }

    try {
        let videos = [];

        
        const videoId = extractVideoId(query);
        if (videoId) {
           
            const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
                params: { 
                    part: "snippet",
                    id: videoId,
                    key: YOUTUBE_API_KEY
                },
            });

            if (response.data.items.length === 0) {
                return res.status(404).json({ error: "Video not found" });
            }

            const video = response.data.items[0];
            videos.push({
                videoId: video.id,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails?.high?.url,
            });

        } else {
            
            const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q: query,
                    type: "video",
                    key: YOUTUBE_API_KEY,
                    maxResults
                },
            });

            videos = response.data.items.map((video) => ({
                videoId: video.id.videoId,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails?.high?.url,
            }));
        }

        res.json({ message: "Videos fetched successfully", videos });
    } catch (error) {
        console.error("YouTube API Error:", error.response?.data || error.message || error);
        res.status(500).json({ error: "Failed to fetch YouTube videos" });
    }
};



export const summarizeVideo = async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) return res.status(400).json({ error: "Transcript is required in the request body" });

    try {
        const summary = await summarizeText(transcript);
        res.json({ message: "Summary generated successfully", summary });
    } catch (error) {
        console.error("AI Summarization Error:", error.message || error);
        res.status(500).json({ error: "Failed to summarize video" });
    }
};


export const generateQuizFromVideo = async (req, res) => {
    const { videoId: youtubeId } = req.body;
    if (!youtubeId) return res.status(400).json({ error: "VideoId is required in the request body" });

    try {
        let video = await Video.findOne({ youtubeId });

        if (!video) {
            const videoDetails = await extractVideoId(youtubeId, YOUTUBE_API_KEY);
            if (!videoDetails) return res.status(404).json({ error: `Video with ID ${youtubeId} not found` });

            video = new Video({
                youtubeId,
                title: videoDetails.title,
                description: videoDetails.description,
                transcript: videoDetails.transcript || "",
            });
            await video.save();
        }

        if (!video.transcript) {
            return res.status(400).json({ error: `Transcript not available for video: ${youtubeId}. Please try another video.` });
        }

        const questions = await generateQuestions(video.transcript);
        res.json({ message: "Quiz generated successfully", questions });
    } catch (error) {
        console.error("Quiz Generation Error:", error.message || error);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
};

export const recommendTopics = async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required in the request body" });

    try {
        const recommendations = await recommendVideos(topic);
        res.json({ message: "Recommendations generated successfully", recommendations });
    } catch (error) {
        console.error("AI Recommendation Error:", error.message || error);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
};
export const handleProcessYouTubeVideo = async (req, res) => {
    console.log("Incoming request body:", req.body); 
  
    const { url } = req.body;
  
    if (!url || typeof url !== "string") {
      console.error("Invalid YouTube URL received:", url);
      return res.status(400).json({ error: "YouTube URL is required and must be a string." });
    }
  
    try {
      const result = await processYouTubeVideo(url);
      res.json({ message: "Video processed successfully", ...result });
    } catch (error) {
      console.error("YouTube Processing Error:", error.message || error);
      res.status(500).json({ error: "Failed to process YouTube video." });
    }
  };
  
  