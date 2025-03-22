import { Request, Response } from 'express';
import * as queueServices from '../services/queue.services';

export const addMessageToQueue = async (req: Request, res: Response): Promise<void> => {
    try {
        const { topic, content } = req.body;
        if (!topic || !content) {
            res.status(400).json({ error: "Topic and content are required." });
            return
        }
        await queueServices.addMessageToQueue(topic, content);
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error: any) {
        console.error("Error in controller:", error);
        res.status(500).json({ error: error.message });
    }
};