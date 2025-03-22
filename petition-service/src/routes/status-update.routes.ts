import express from 'express'
import { validate } from '../middleware/validateRequest';
import { createStatusUpdateSchema } from '../validators/status-update';
import { createStatusUpdate } from '../controllers/status-update.controller';

const router = express.Router();

router.post("/" , validate(createStatusUpdateSchema) , createStatusUpdate)

export default router;