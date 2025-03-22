import express from "express";
import { validate } from "../middleware/validateRequest";
import { createQueueMessageSchema } from "../validators/queue";
import { addMessageToQueue } from "../controllers/queue.controller";

const router = express.Router();

router.post("/add", validate(createQueueMessageSchema), addMessageToQueue);

export default  router;