import { Request, Response } from "express";
import PetitionEmbedding from "../models/embedding.model";
import { generateEmbedding } from "../services/embedding.services";


export const searchSimilarPetition = async (req: Request, res: Response): Promise<void> => {
  try {
    let { text, tag, id } = req.body;

    const embedding = await generateEmbedding(text);
    if (!embedding) {
      res.status(500).json({ message: "Failed to generate embedding" });
      return
    }

    const numCandidates = 100; // Fetch 100 candidates initially
    const finalLimit = 15; // Return only top 15 results

    const matchStage: {
      _id?: { $ne: string };
      tag: string;
    } = { tag };

    if (id) matchStage._id = { $ne: id }; // Exclude the specified ID

    const results = await PetitionEmbedding.aggregate([
      {
        $vectorSearch: {
          index: "index_on_embedding",
          path: "embedding",
          queryVector: embedding,
          numCandidates,
          limit: numCandidates, // Fetch 100 candidates
          filter: { tag: tag }, // Pre-filter inside vector search
        },
      },
      { $match: matchStage },
      {
        $project: {
          _id: 1,
          text: 1,
          similarity: { $meta: "vectorSearchScore" },
          tag: 1,
          petitionId: 1
        },
      },
      { $sort: { similarity: -1 } }, // Sort by similarity score (highest first)
      { $limit: finalLimit }, // Select only the top 15 results
    ]);

    res.json({ results });
  } catch (error) {
    console.error("Error searching petitions:", (error as any).message);
    res.status(500).json({ message: "Server error" });
  }
}