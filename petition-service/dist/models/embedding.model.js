"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PetitionEmbeddingSchema = new mongoose_1.default.Schema({
    petitionId: { type: String, required: true, index: true },
    embedding: { type: [Number], required: true },
    tag: { type: String, required: true, index: true },
    isProcessed: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Petition", PetitionEmbeddingSchema);
