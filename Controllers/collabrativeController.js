import { Server } from "socket.io";
import Note from "../Models/note";

export const setupCollaborativeNotes = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinNote", async ({ noteId }) => {
      socket.join(noteId);
      const note = await Note.findById(noteId);
      socket.emit("loadNote", note.content);
    });

    socket.on("updateNote", async ({ noteId, content }) => {
      await Note.findByIdAndUpdate(noteId, { content });
      socket.to(noteId).emit("noteUpdated", content);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
 