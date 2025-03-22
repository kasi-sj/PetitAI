"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationDepartmentsSchema = exports.getAllOrganizationsSchema = exports.deleteOrganizationSchema = exports.getOrganizationSchema = exports.updateOrganizationSchema = exports.createOrganizationSchema = void 0;
const zod_1 = require("zod");
exports.createOrganizationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty(),
        imageURL: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        website: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        establishedYear: zod_1.z.number().int().min(1800).max(new Date().getFullYear()).optional(),
        email: zod_1.z.string().email().optional(),
        isActive: zod_1.z.boolean().default(true),
        similarityThreshold: zod_1.z.number().int().min(0).max(100).default(90),
    }),
});
exports.updateOrganizationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        imageURL: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        website: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        establishedYear: zod_1.z.number().int().min(1800).max(new Date().getFullYear()).optional(),
        email: zod_1.z.string().email().optional(),
        isActive: zod_1.z.boolean().optional(),
        similarityThreshold: zod_1.z.number().int().min(0).max(100).optional(),
    }),
});
exports.getOrganizationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.deleteOrganizationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.getAllOrganizationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.number().int().positive().default(10).optional(),
        page: zod_1.z.number().int().positive().default(1).optional(),
    }),
});
exports.getOrganizationDepartmentsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
