import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    hashedPassword: z.string().optional(),
    googleId: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    profilePic: z.string().optional(),
    address: z.string().optional(),
    phoneNo: z.string().optional(),
    bio: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    dob: z.string().optional(),
    gender: z.string().optional(),
    profilePic: z.string().optional(),
    address: z.string().optional(),
    phoneNo: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getAllUsersSchema = z.object({
  query: z.object({
    limit: z.number().int().positive().default(10).optional(),
    page: z.number().int().positive().default(1).optional(),
  }),
});

export const getUserOrganizationsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getUserPetitionsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    organization: z.string().optional(),
    limit: z.string().default("10").optional(),
    page: z.string().default("1").optional(),
  }),
});

export const getOrganizationPetition = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    query: z.object({
        isPending: z.string().optional(),
        limit: z.string().default("10").optional(),
        page: z.string().default("1").optional(),
    }),
})
