import { query } from "express";
import { z } from "zod";

export const createOrganizationSchema = z.object({
    body: z.object({
        name: z.string().nonempty(),
        imageURL: z.string().url().optional(),
        description: z.string().optional(),
        website: z.string().url().optional(),
        phoneNumber: z.string().regex(/^\d+$/).optional(),
        address: z.string().optional(),
        establishedYear: z.union([z.string().regex(/^\d{4}$/), z.number().int().min(1800).max(new Date().getFullYear())]),
        email: z.string().email().optional(),
        isActive: z.boolean().default(true),
        similarityThreshold: z.number().int().min(0).max(100).default(90),
        departments: z.array(
            z.object({
                name: z.string().nonempty(),
                description: z.string().nonempty(),
            })
        ).optional(),
        userId: z.string(),
    }),
});

export const updateOrganizationSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        name: z.string().optional(),
        imageURL: z.string().optional(),//
        description: z.string().optional(),//
        website: z.string().optional(),//
        phoneNumber: z.string().optional(),//
        address: z.string().optional(),//
        establishedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),//
        email: z.string().email().optional(),//
        isActive: z.boolean().optional(),//
        similarityThreshold: z.number().int().min(0).max(100).optional(),//
        whitelistedEmails : z.array(z.object({
            email : z.string()
        })).optional()
    }),
});

export const getOrganizationSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const deleteOrganizationSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

export const getAllOrganizationsSchema = z.object({
    query: z.object({
        limit: z.number().int().positive().default(10).optional(),
        page: z.number().int().positive().default(1).optional(),
        search: z.string().optional(),
    }),
});

export const getOrganizationDepartmentsSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    query: z.object({
        limit: z.string().default("10").optional(),
        page: z.string().default("1").optional(),
        search: z.string().optional(),
        pagination: z.string().optional(),
    }),
});

export const getOrganizationRolesSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    query: z.object({
        limit: z.string().default("10").optional(),
        page: z.string().default("1").optional(),
        search: z.string().optional(),
    }),
});

export const getOrganizationUsersSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    query: z.object({
        limit: z.string().default("10").optional(),
        page: z.string().default("1").optional(),
        search: z.string().optional(),
    }),
});

export const getOrganizationByNameSchema = z.object({
    params: z.object({
        name: z.string().nonempty(),
    }),
});

export const getPetitionCountSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    query: z.object({
        organizationUserId: z.string().optional(),
        departmentId: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
    }),
})

export const getPetitionCountByDepartmentSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    })
})

