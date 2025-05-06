import mongoose from "mongoose";

const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
