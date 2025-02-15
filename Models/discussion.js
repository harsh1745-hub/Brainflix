import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
    question: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: String,
    },
    userId: {
      type: String,
      ref: "User",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        userId: {
          type: String,
          ref: "User",
        },
        text: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);
