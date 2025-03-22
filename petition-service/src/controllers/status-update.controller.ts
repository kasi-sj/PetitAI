import { Request, Response } from 'express';
import * as statusUpdateServices from '../services/status-update.services';
import * as z from 'zod';
import { createStatusUpdateSchema } from '../validators/status-update'

export const createStatusUpdate = async (req: z.infer<typeof createStatusUpdateSchema>, res: Response) => {
    try {
        const { petitionId, status, description } = req.body
        const statusUpdate = await statusUpdateServices.createStatusUpdate(petitionId, status, description)
        res.status(201).json(statusUpdate)
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error")
    }
}