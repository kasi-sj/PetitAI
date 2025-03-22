"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDepartmentsSchema = exports.deleteDepartmentSchema = exports.getDepartmentSchema = exports.updateDepartmentSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
exports.createDepartmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        organizationId: zod_1.z.string().uuid(),
        name: zod_1.z.string().nonempty(),
        description: zod_1.z.string().optional(),
        isRoot: zod_1.z.boolean().default(false),
    }),
});
exports.updateDepartmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        isRoot: zod_1.z.boolean().optional(),
    }),
});
exports.getDepartmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.deleteDepartmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.getAllDepartmentsSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.number().int().positive().default(10).optional(),
        page: zod_1.z.number().int().positive().default(1).optional(),
    }),
});
