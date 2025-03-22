"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoleById = exports.getAllRoles = void 0;
const db_1 = require("../config/db");
// Get all roles
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield db_1.prisma.role.findMany();
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch roles" });
    }
});
exports.getAllRoles = getAllRoles;
// Get role by ID
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield db_1.prisma.role.findUnique({
            where: { id }
        });
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }
        res.json(role);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch role" });
    }
});
exports.getRoleById = getRoleById;
// Create a new role
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { organizationId, roleName, priority } = req.body;
        const role = yield db_1.prisma.role.create({
            data: {
                organizationId,
                roleName,
                priority
            }
        });
        res.status(201).json(role);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create role" });
    }
});
exports.createRole = createRole;
// Update an existing role
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield db_1.prisma.role.update({
            where: { id },
            data: Object.assign({}, req.body)
        });
        res.json(role);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update role" });
    }
});
exports.updateRole = updateRole;
// Delete a role
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const role = yield db_1.prisma.role.delete({
            where: { id }
        });
        res.json(role);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete role" });
    }
});
exports.deleteRole = deleteRole;
