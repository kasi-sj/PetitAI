"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const embedding_controller_1 = require("../controllers/embedding.controller");
const petition_1 = require("../validators/petition");
const validateRequest_1 = require("../middleware/validateRequest");
const router = express_1.default.Router();
router.post("/search", (0, validateRequest_1.validate)(petition_1.searchSimilarPetitionSchema), embedding_controller_1.searchSimilarPetition);
exports.default = router;
