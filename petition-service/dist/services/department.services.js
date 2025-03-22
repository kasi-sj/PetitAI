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
exports.getDepartmentsByOrganizationId = exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartmentById = exports.getAllDepartments = void 0;
const db_1 = require("../config/db");
const getAllDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.department.findMany();
});
exports.getAllDepartments = getAllDepartments;
const getDepartmentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.department.findUnique({
        where: { id },
    });
});
exports.getDepartmentById = getDepartmentById;
const createDepartment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield db_1.prisma.department.create({ data });
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.createDepartment = createDepartment;
const updateDepartment = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.department.update({
        where: { id },
        data,
    });
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.department.delete({
        where: { id },
    });
});
exports.deleteDepartment = deleteDepartment;
const getDepartmentsByOrganizationId = (organizationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.prisma.department.findMany({
        where: { organizationId: organizationId }
    });
});
exports.getDepartmentsByOrganizationId = getDepartmentsByOrganizationId;
