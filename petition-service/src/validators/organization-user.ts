import * as z from "zod";

export const createOrganizationUserSchema = z.object({
  body: z.object({
    organizationId: z.string().uuid(),
    departmentId: z.string().uuid().optional(),
    roleId: z.string().uuid(),
    reportToId: z.string().uuid().optional(),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email format").optional(),
    hashedPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    imageURL: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getOrganizationUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getAllOrganizationUsersSchema = z.object({
  query: z.object({}).optional(),
});

export const updateOrganizationUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    departmentId: z.string().uuid().optional(),
    roleId: z.string().uuid().optional(),
    reportToId: z.string().uuid().optional(),
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    hashedPassword: z.string().min(6).optional(),
    imageURL: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteOrganizationUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const isUserExistSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    organizationId: z.string().uuid(),
  }),
});

export const getReportToUserByRoleIdSchema = z.object({
  params: z.object({
    roleId: z.string().uuid(),
  }),
  query: z.object({
    limit: z.string().default("10").optional(),
    page: z.string().default("1").optional(),
    search: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    name: z.string(),
    password: z.string(),
    organizationId: z.string().uuid(),
  }),
});

export const getOrganizationUserPetitionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    isPending: z.string().optional(),
    limit: z.string().default("10").optional(),
    page: z.string().default("1").optional(),
  }),
});
