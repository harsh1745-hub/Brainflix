import UserStats from "../Models/userStats.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await UserStats.find()
      .sort({ xp: -1 })
      .limit(10)
      .populate("userId", "username profilePicture");

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching leaderboard", error });
  }
};

export const updateXp = async (req, res) => {
  try {
    const { userId, xpGained } = req.body;

    let userStats = await UserStats.findOne({ userId });
    if (!userStats) {
      userStats = new UserStats({ userId });
    }

    userStats.xp += xpGained;

    const newLevel = Math.floor(userStats.xp / 100) + 1;
    if (newLevel > userStats.level) {
      userStats.level = newLevel;
    }

    await userStats.save();
    res.status(200).json({ success: true, userStats });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating XP", error });
  }
};

export const trackStreak = async (req, res) => {
  try {
    const { userId } = req.body;
    const userStats = await UserStats.findOne({ userId });

    if (!userStats)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(userStats.lastActivity).setHours(0, 0, 0, 0);

    if (lastActive < today - 86400000) {
      userStats.streak = 1;
    } else if (lastActive < today) {
      userStats.streak += 1;
    }

    userStats.lastActivity = Date.now();
    await userStats.save();

    res.status(200).json({ success: true, streak: userStats.streak });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error tracking streak", error });
  }
};
