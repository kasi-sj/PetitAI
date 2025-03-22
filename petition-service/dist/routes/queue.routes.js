"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const queue_1 = require("../validators/queue");
const queue_controller_1 = require("../controllers/queue.controller");
const router = express_1.default.Router();
router.post("/add", (0, validateRequest_1.validate)(queue_1.createQueueMessageSchema), queue_controller_1.addMessageToQueue);
exports.default = router;
