import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    youtubeId: {
      type: String,
      required: true,
      unique: true,
      index: true, 
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    transcript: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
    },
    aiGeneratedNotes: [
      {
        timestamp: {
          type: Number, 
          required: true,
          min: 0,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: ["key_point", "definition", "example", "summary", "insight"],
          required: true,
        },
        source: {
          type: String, 
          default: "AI",
        },
      },
    ],
    userNotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Number,
          required: true,
          min: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
        },
      },
    ],
    metadata: {
      duration: {
        type: Number, 
        required: true,
      },
      viewCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      tags: {
        type: [String],
        default: [],
      },
      thumbnailUrl: {
        type: String,
        default: "",
      },
      publishedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true, 
  }
);


videoSchema.index({ title: "text", description: "text" });

export default mongoose.model("Video", videoSchema);
