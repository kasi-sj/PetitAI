import mongoose from "mongoose";

const PetitionEmbeddingSchema = new mongoose.Schema({
  petitionId: { type: String, required: true, index: true },
  embedding: { type: [Number], required: true },
  tag: { type: String, required: true, index: true },
  isProcessed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Petition", PetitionEmbeddingSchema);