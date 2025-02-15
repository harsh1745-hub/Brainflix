import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      badges: [{ type: String }], 
      streak: { type: Number, default: 0 },
      lastActivity: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  

export default mongoose.model('UserStats', userStatsSchema);