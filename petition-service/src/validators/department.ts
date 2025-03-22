import { query } from "express";
import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    organizationId: z.string().uuid(),
    name: z.string().nonempty(),
    description: z.string().optional(),
    isRoot: z.boolean().default(false),
    users: z.array(z.string().uuid()).optional(),
  }),
});

export const isDepartmentExistSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    organizationId: z.string().uuid(),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isRoot: z.boolean().optional(),
    usersToRemove: z.array(z.string().uuid()).optional(),
    usersToAdd: z.array(z.string().uuid()).optional(),
  }),
});

export const getDepartmentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteDepartmentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getAllDepartmentsSchema = z.object({
  query: z.object({
    limit: z.number().int().positive().default(10).optional(),
    page: z.number().int().positive().default(1).optional(),
    includeRoot: z.string().default("false").optional(),
  }),
});

export const getAvailableUsersSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getOrganizationUsersSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    limit: z.number().int().positive().default(10).optional(),
    page: z.number().int().positive().default(1).optional(),
    search: z.string().optional(),
  }),
});
