import { z } from "zod";

export const deleteEmbeddingSchema = z.object({
    body: z.object({
        passCode : z.string().refine((val) => val == "Delete all", { message: "Need to put the passcode" }),
    }),
});
