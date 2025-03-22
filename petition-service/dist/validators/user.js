"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersSchema = exports.deleteUserSchema = exports.getUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty(),
        email: zod_1.z.string().email(),
        hashedPassword: zod_1.z.string().optional(),
        googleId: zod_1.z.string().optional(),
        dob: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        profilePic: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        phoneNo: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        hashedPassword: zod_1.z.string().optional(),
        googleId: zod_1.z.string().optional(),
        dob: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        profilePic: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        phoneNo: zod_1.z.string().optional(),
        bio: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
});
exports.getAllUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.number().int().positive().default(10).optional(),
        page: zod_1.z.number().int().positive().default(1).optional(),
    }),
});
