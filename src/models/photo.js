import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Custom ID (String)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  imageUrl: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  caption: String,
});

export default mongoose.model("Photo", PhotoSchema);
