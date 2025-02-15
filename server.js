import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import dotenv from "dotenv";
import ratelimit from "express-rate-limit";
import connectDb from "./Config/db.js";
import SocketService from "./Service/socketService.js";
import auth from "./Routes/userAuth.js";
import notes from "./Routes/notes.js";
import quiz from "./Routes/quiz.js";
import videos from "./Routes/video.js";
import playList from "./Routes/playList.js";
import save from "./Routes/save.js";
import genrateflash from "./Routes/flashCard.js";
import userProgressRoute from "./Routes/userProgressRoute.js";
import discussion from "./Routes/discussion.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

SocketService.initialize(server);

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

connectDb();

app.use("/user", auth);
app.use("/notes", notes);
app.use("/quiz", quiz);
app.use("/video", videos);
app.use("/playlist", playList);
app.use("/save", save);
app.use("/flashcards", genrateflash);
app.use("/progress", userProgressRoute);
app.use("/discussion", discussion);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
