import { z } from "zod";


export const createPetitionSchema = z.object({
    body: z.object({
        id: z.string().uuid().optional(),
        fromUserId: z.string().uuid(),
        organizationId: z.string().uuid(),
        departmentId: z.string().uuid().optional(),
        subject: z.string().nonempty(),
        body: z.string().nonempty(),
        tag: z.string().nonempty(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        attachments: z.array(z.string()).optional(),
    }),
});

export const updatePetitionSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
        departmentId: z.string().uuid().nullable(),
        tag: z.string(),
    }),
});

export const changePetitionStatusSchema = z.object({   
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        isActive: z.string().refine((value) => value === "true" || value === "false", { message: "isActive must be a boolean" }),
    }),
});

export const getPetitionSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    query : z.object({
        includeUser : z.string().optional()
    })
});

export const getMostSimilarPetitionSchema = z.object({
    body: z.object({
        text: z.string().nonempty(),
        tag: z.string().nonempty()
    })
});

export const deletePetitionSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});


export const getAllPetitionsSchema = z.object({
    query: z.object({
        limit: z.number().int().positive().default(10).optional(),
        page: z.number().int().positive().default(1).optional(),
    }),
});

export const assignPetitionToOrgUserSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    }),
    body: z.object({
        organizationUserId :z.string().uuid().optional()
    })
});

export const getMostSimilarPetitionsSchema = getPetitionSchema;