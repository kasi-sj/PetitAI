"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMostSimilarEmbeddingResult = exports.deletePetitionEmbedding = exports.addPetitionEmbedding = exports.generateEmbedding = void 0;
const axios_1 = __importDefault(require("axios"));
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL || "";
const embedding_model_1 = __importDefault(require("../models/embedding.model"));
/**
 * Generate text embedding using the Hugging Face API
 * @param {string} text
 * @returns {Promise<number[]>} Embedding vector
 */
const generateEmbedding = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(EMBEDDING_API_URL, { text });
        return response.data.embedding || null;
    }
    catch (error) {
        console.error("Embedding API error:", error.message);
        return [];
    }
});
exports.generateEmbedding = generateEmbedding;
const addPetitionEmbedding = (petition) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = petition.title + " " + petition.description;
        const petitionId = petition._id;
        const tag = petition.tag;
        const embedding = yield (0, exports.generateEmbedding)(text);
        const petitionEmbedding = new embedding_model_1.default({
            petitionId: petitionId,
            tag: tag,
            embedding: embedding,
        });
        yield petitionEmbedding.save();
        return petitionEmbedding;
    }
    catch (error) {
        console.error("Error adding petition embedding:", error.message);
        return null;
    }
});
exports.addPetitionEmbedding = addPetitionEmbedding;
const deletePetitionEmbedding = (petitionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield embedding_model_1.default.deleteOne({
            petitionId: petitionId
        });
        return true;
    }
    catch (error) {
        console.error("Error deleting petition embedding:", error.message);
        return false;
    }
});
exports.deletePetitionEmbedding = deletePetitionEmbedding;
const getMostSimilarEmbeddingResult = (text, tag) => __awaiter(void 0, void 0, void 0, function* () {
    const embedding = yield (0, exports.generateEmbedding)(text);
    // Perform vector search to find the most similar petition
    const result = yield embedding_model_1.default.aggregate([
        {
            $vectorSearch: {
                index: "index_on_embedding",
                path: "embedding",
                queryVector: embedding,
                numCandidates: 300, // Adjust candidates to optimize performance
                limit: 1, // Only return the most relevant match
                filter: { tag }, // Pre-filter based on tag
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
    return result;
});
exports.getMostSimilarEmbeddingResult = getMostSimilarEmbeddingResult;
