"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const petition_1 = require("../validators/petition");
const petition_controller_1 = require("../controllers/petition.controller");
const router = express_1.default.Router();
router.get("/", (0, validateRequest_1.validate)(petition_1.getAllPetitionsSchema), petition_controller_1.getAllPetitions);
router.get("/:id", (0, validateRequest_1.validate)(petition_1.getPetitionSchema), petition_controller_1.getPetitionById);
router.post("/", (0, validateRequest_1.validate)(petition_1.createPetitionSchema), petition_controller_1.createPetition);
router.put("/:id", (0, validateRequest_1.validate)(petition_1.updatePetitionSchema), petition_controller_1.updatePetition);
router.delete("/:id", (0, validateRequest_1.validate)(petition_1.deletePetitionSchema), petition_controller_1.deletePetition);
exports.default = router;
