import axios from "axios";
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || "";
import Petition from "../models/embedding.model";
import { prisma } from "../config/db";
/**
 * Generate text embedding using the Hugging Face API
 * @param {string} text
 * @returns {Promise<number[]>} Embedding vector
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await axios.post(EMBEDDING_API_URL, { text });
    return response.data.embedding || null;
  } catch (error) {
    console.error("Embedding API error:", (error as any).message);
    return [];
  }
};

interface PetitionInput {
  _id: string;
  text: string;
  tag: string;
}

interface PetitionEmbedding {
  petitionId: string;
  tag: string;
  embedding: number[];
}

export const addPetitionEmbedding = async (petition: PetitionInput): Promise<PetitionEmbedding | null> => {
  try {
    const petitionId = petition._id;
    const tag = petition.tag;
    const text = petition.text;
    const embedding = await generateEmbedding(text);
    const petitionEmbedding = new Petition({
      petitionId: petitionId,
      tag: tag,
      embedding: embedding,
    });
    await petitionEmbedding.save();
    return petitionEmbedding;
  } catch (error) {
    console.error("Error adding petition embedding:", (error as any).message);
    return null;
  }
}

export const updatePetitionEmbedding = async (PetitionId: string, tag: string) => {
  try {
    // const updatedPetition = await Petition.findByIdAndUpdate(
    //   PetitionId,
    //   {
    //     $set: {
    //       tag: tag,
    //     },
    //   },
    //   { new: true }
    // );
    const petition = await Petition.findOne({ petitionId: PetitionId })
    if (!petition) {
      throw new Error("Petition not found");
    }
    petition.tag = tag;
    await petition.save();
    return petition;
  } catch (e) {
    return { "message": "Failed to update the petition" }
  }
}

export const deletePetitionEmbedding = async (petitionId: string): Promise<boolean> => {
  try {
    await Petition.deleteOne
      ({
        petitionId: petitionId
      });
    return true;
  } catch (error) {
    console.error("Error deleting petition embedding:", (error as any).message);
    return false;
  }
}

export const getMostSimilarEmbeddingResult = async (text: string, tag: string) => {
  const embedding = await generateEmbedding(text)
  // Perform vector search to find the most similar petition
  const result = await Petition.aggregate([
    {
      $vectorSearch: {
        index: "index_on_embedding",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 300, // Adjust candidates to optimize performance
        limit: 1, // Only return the most relevant match
        filter: {
          tag,
          createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5) }
        }, // Pre-filter based on tag
      },
    },
    {
      $project: {
        petitionId: 1,
        similarity: { $meta: "vectorSearchScore" },
      },
    },
    { $sort: { similarity: -1 } }, // Highest similarity first
    { $limit: 1 }, // Ensure we return only one result
  ]);

  return result
}

export const getMostSimilarEmbeddings = async (text: string, tag: string) => {

  const embedding = await generateEmbedding(text);
  // getting top 15 matches except the petition itself
  const result = await Petition.aggregate([
    {
      $vectorSearch: {
        index: "index_on_embedding",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 301, // Adjust candidates to optimize performance
        limit: 16, // Only return the most relevant match
        filter: {
          tag,
          createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5) }
        }, // Pre-filter based on tag
      },
    },
    {
      $project: {
        petitionId: 1,
        similarity: { $meta: "vectorSearchScore" },
      },
    },
    { $sort: { similarity: -1 } }, // Highest similarity first
  ]);
  return result
}