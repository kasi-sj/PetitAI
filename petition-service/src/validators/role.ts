import { z } from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    organizationId: z.string().uuid(),
    roleName: z.string().nonempty("Role name is required"),
    priority: z.number().int().positive("Priority must be a positive integer"),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    organizationId: z.string().uuid().optional(),
    roleName: z.string().optional(),
    priority: z.number().int().positive().optional(),
  }),
});

export const getRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteRoleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const isRoleExists = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    organizationId: z.string().uuid(),
  }),
});

export const getAllRolesSchema = z.object({
  query: z.object({
    organizationId: z.string().uuid().optional(), // Filter by organization
    limit: z.number().int().positive().default(10).optional(),
    page: z.number().int().positive().default(1).optional(),
  }),
});
