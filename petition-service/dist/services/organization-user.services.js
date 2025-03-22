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
exports.deleteOrganizationUser = exports.updateOrganizationUser = exports.createOrganizationUser = exports.getOrganizationUserById = exports.getAllOrganizationUsers = void 0;
const db_1 = require("../config/db");
const getAllOrganizationUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.organizationUser.findMany();
});
exports.getAllOrganizationUsers = getAllOrganizationUsers;
const getOrganizationUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.organizationUser.findUnique({
        where: { id },
    });
});
exports.getOrganizationUserById = getOrganizationUserById;
const createOrganizationUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate Organization ID
    const organization = yield db_1.prisma.organization.findUnique({
        where: { id: data.organizationId },
    });
    if (!organization)
        throw new Error("Organization not found.");
    // Validate Role ID
    const role = yield db_1.prisma.role.findUnique({
        where: { id: data.roleId },
    });
    if (!role)
        throw new Error("Role not found.");
    // Validate Department ID (if provided)
    if (data.departmentId) {
        const department = yield db_1.prisma.department.findUnique({
            where: { id: data.departmentId },
        });
        if (!department)
            throw new Error("Department not found.");
    }
    return db_1.prisma.organizationUser.create({ data });
});
exports.createOrganizationUser = createOrganizationUser;
const updateOrganizationUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.organizationUser.update({
        where: { id },
        data,
    });
});
exports.updateOrganizationUser = updateOrganizationUser;
const deleteOrganizationUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.organizationUser.delete({
        where: { id },
    });
});
exports.deleteOrganizationUser = deleteOrganizationUser;
