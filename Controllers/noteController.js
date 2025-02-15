import LiveNotes from "../Models/note.js";
import Video from "../Models/videoModel.js";
import { fetchVideoTranscript, generateLiveNotes } from "../API/aiservice.js";


export const generateLiveNotess = async (req, res) => {
  try {
    const { videoId } = req.body;

    
    const video = await Video.findOne({ youtubeId: videoId });
    if (!video) return res.status(404).json({ message: "Video not found" });

    
    const transcript = await fetchVideoTranscript(videoId);
    if (!transcript || transcript.length === 0)
      return res.status(500).json({ message: "No transcript available" });

  
    const aiNotes = await generateLiveNotes(transcript);
    if (!aiNotes || aiNotes.length === 0)
      return res.status(500).json({ message: "AI note generation failed" });

    const savedNotes = await LiveNotes.insertMany(
      aiNotes.map((note) => ({
        videoId: video._id,
        timestamp: note.timestamp,
        text: note.text,
      }))
    );

    res.status(201).json(savedNotes);
  } catch (error) {
    console.error("Error generating live notes:", error);
    res
      .status(500)
      .json({ message: "Error generating live notes", error: error.message });
  }
};


export const getLiveNotes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const notes = await LiveNote.find({ videoId }).sort({ timestamp: 1 });

    if (!notes.length)
      return res.status(404).json({ message: "No live notes found" });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching live notes:", error);
    res
      .status(500)
      .json({ message: "Error fetching live notes", error: error.message });
  }
};
