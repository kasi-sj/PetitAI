import { z } from "zod";

export const createStatusUpdateSchema = z.object({
    body: z.object({
        petitionId: z.string().uuid(),
        status: z.enum([
            "ERROR",
            "SUBMITTED",
            "QUEUED",
            "CATEGORIZING",
            "CATEGORY_ASSIGNED",
            "ASSIGNED",
            "DELEGATED",
            "FORWARDED",
            "PROCESSING",
            "REPEATED_REJECTION",
            "REJECTED",
            "PROCESSED",]),
        description: z.string(),
    }),
});