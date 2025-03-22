"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPetitionsSchema = exports.deletePetitionSchema = exports.getPetitionSchema = exports.updatePetitionSchema = exports.createPetitionSchema = exports.searchSimilarPetitionSchema = void 0;
const zod_1 = require("zod");
exports.searchSimilarPetitionSchema = zod_1.z.object({
    text: zod_1.z.string().nonempty(),
    tag: zod_1.z.string().nonempty()
});
exports.createPetitionSchema = zod_1.z.object({
    body: zod_1.z.object({
        fromUserId: zod_1.z.string().uuid(),
        organizationId: zod_1.z.string().uuid(),
        departmentId: zod_1.z.string().uuid().optional(),
        subject: zod_1.z.string().nonempty(),
        body: zod_1.z.string().nonempty(),
        tag: zod_1.z.string().nonempty(),
        priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]),
        attachments: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updatePetitionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        fromUserId: zod_1.z.string().uuid().optional(),
        organizationId: zod_1.z.string().uuid().optional(),
        departmentId: zod_1.z.string().uuid().nullable().optional(),
        subject: zod_1.z.string().optional(),
        body: zod_1.z.string().optional(),
        tag: zod_1.z.string().optional(),
        priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        attachments: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.getPetitionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.deletePetitionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.getAllPetitionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.number().int().positive().default(10).optional(),
        page: zod_1.z.number().int().positive().default(1).optional(),
    }),
});
