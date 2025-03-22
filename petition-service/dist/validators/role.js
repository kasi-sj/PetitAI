"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRolesSchema = exports.deleteRoleSchema = exports.getRoleSchema = exports.updateRoleSchema = exports.createRoleSchema = void 0;
const zod_1 = require("zod");
exports.createRoleSchema = zod_1.z.object({
    body: zod_1.z.object({
        organizationId: zod_1.z.string().uuid(),
        roleName: zod_1.z.string().nonempty("Role name is required"),
        priority: zod_1.z.number().int().positive("Priority must be a positive integer"),
    }),
});
exports.updateRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        organizationId: zod_1.z.string().uuid().optional(),
        roleName: zod_1.z.string().optional(),
        priority: zod_1.z.number().int().positive().optional(),
    }),
});
exports.getRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.deleteRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.getAllRolesSchema = zod_1.z.object({
    query: zod_1.z.object({
        organizationId: zod_1.z.string().uuid().optional(), // Filter by organization
        limit: zod_1.z.number().int().positive().default(10).optional(),
        page: zod_1.z.number().int().positive().default(1).optional(),
    }),
});
