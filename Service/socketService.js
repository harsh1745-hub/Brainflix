import { Server } from "socket.io";
import { fetchVideoTranscript, generateLiveNotes } from "../API/aiservice.js";


export const extractVideoId = (input) => {
  if (input.length === 11) return input;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]{11})/;
  return input.match(regex)?.[1] || null;
};

class SocketService {
  static io;

  static initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on("start_live_notes", async ({ videoId }) => {
        try {
          const validVideoId = extractVideoId(videoId);
          if (!validVideoId) throw new Error("Invalid YouTube URL or Video ID.");

          console.log(`Generating live notes for: ${validVideoId}`);

          const transcript = await fetchVideoTranscript(`https://www.youtube.com/watch?v=${validVideoId}`);
          if (!transcript) throw new Error("Could not fetch transcript.");

          let currentTime = 0; 

      
          const notes = await generateLiveNotes(transcript);
          if (typeof notes === "string") {
            const noteSegments = notes.split(/(?<=[.?!])\s+/);

            for (const segment of noteSegments) {
              currentTime += 5; 

              socket.emit("note", { note: segment, timestamp: currentTime });

              await new Promise((resolve) => setTimeout(resolve, 3000));
            }
          } else {
            console.error("Unexpected AI response:", notes);
            socket.emit("error", { message: "Failed to generate live notes." });
          }
        } catch (error) {
          console.error("Live Notes Error:", error);
          socket.emit("error", { message: error.message || "Failed to fetch live notes." });
        }
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

export default SocketService;
