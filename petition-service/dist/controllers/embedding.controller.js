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
exports.searchSimilarPetition = void 0;
const embedding_model_1 = __importDefault(require("../models/embedding.model"));
const embedding_services_1 = require("../services/embedding.services");
const searchSimilarPetition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { text, tag, id } = req.body;
        const embedding = yield (0, embedding_services_1.generateEmbedding)(text);
        if (!embedding) {
            res.status(500).json({ message: "Failed to generate embedding" });
            return;
        }
        const numCandidates = 100; // Fetch 100 candidates initially
        const finalLimit = 15; // Return only top 15 results
        const matchStage = { tag };
        if (id)
            matchStage._id = { $ne: id }; // Exclude the specified ID
        const results = yield embedding_model_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error searching petitions:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});
exports.searchSimilarPetition = searchSimilarPetition;
