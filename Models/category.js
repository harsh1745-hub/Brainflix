import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true }, 
  title: { type: String, required: true }, 
  description: { type: String }, 
  categories: [{ type: String, required: true }], 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Category", CategorySchema);
