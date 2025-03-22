"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationUserSchema = exports.updateOrganizationUserSchema = exports.getAllOrganizationUsersSchema = exports.getOrganizationUserSchema = exports.createOrganizationUserSchema = void 0;
const z = __importStar(require("zod"));
exports.createOrganizationUserSchema = z.object({
    body: z.object({
        organizationId: z.string().uuid(),
        departmentId: z.string().uuid().optional(),
        roleId: z.string().uuid(),
        reportToId: z.string().uuid().optional(),
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.string().email("Invalid email format"),
        hashedPassword: z.string().min(6, "Password must be at least 6 characters long"),
        imageURL: z.string().url().optional(),
        isActive: z.boolean().optional(),
    }),
});
exports.getOrganizationUserSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});
exports.getAllOrganizationUsersSchema = z.object({
    query: z.object({}).optional(),
});
exports.updateOrganizationUserSchema = z.object({
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
exports.deleteOrganizationUserSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});
