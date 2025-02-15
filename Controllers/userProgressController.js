import userProgress from "../Models/userProgress.js";

export const saved = async (req, res) => {
  try {
    const { userId, videoId, title } = req.body;
    let progress = await userProgress.findOne({ userId });
    if (!progress) {
      progress = new userProgress({ userId, watchedVideos: [] });
    }
    progress.watchedVideos.push({ videoId, title, watchedAt: new Date() });
    await progress.save();
    res.json({ message: "progress saved succesfully" });
  } catch (error) {
    res.status(400).json({ message: "Error in saving", error });
  }
};

export const completedTopics = async (req, res) => {
  try {
    const { userId, topicId, topicName } = req.body;
    let progress = await userProgress.findOne({ userId });
    if (!progress) {
      progress = new userProgress({ userId, completedTopics: [] });
    }
    progress.completedTopics.push({
      topicId,
      topicName,
      completedAt: new Date(),
    });
    await progress.save();
    res.json({ message: "completed topic save" });
  } catch (error) {
    res.status(400).json({ message: "Error in saving", error });
  }
};

export const saveQuiz = async (req, res) => {
  try {
    const { userId, topicId, score, total } = req.body;
    let progress = await userProgress.findOne({ userId });
    if (!progress) {
      progress = new userProgress({ userId, quizScores: [] });
    }
    progress.quizScores.push({ topicId, score, total, takenAt: new Date() });
    await progress.save();
    res.json({ message: "quiz score saved succesfully" });
  } catch (error) {
    res.status(400).json({ message: "Error in saving", error });
  }
};

export const fetchUserProgress=async(req,res)=>{
    try {
        const progress=await userProgress.findOne({userId:req.params.userId});
        if(!progress) return res.json({message:"No progress found"})
            res.json(progress)
    } catch (error) {
        res.status(400).json({message:"Error in fetching in profile"})
        
    }
}
