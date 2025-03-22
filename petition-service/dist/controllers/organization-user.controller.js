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
const organization_user_services_1 = require("../services/organization-user.services");
const getAllOrganizationUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, organization_user_services_1.getAllOrganizationUsers)();
        res.json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
exports.getAllOrganizationUsers = getAllOrganizationUsers;
const getOrganizationUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, organization_user_services_1.getOrganizationUserById)(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
exports.getOrganizationUserById = getOrganizationUserById;
const createOrganizationUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, organization_user_services_1.createOrganizationUser)(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.createOrganizationUser = createOrganizationUser;
const updateOrganizationUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, organization_user_services_1.updateOrganizationUser)(req.params.id, req.body);
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.updateOrganizationUser = updateOrganizationUser;
const deleteOrganizationUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, organization_user_services_1.deleteOrganizationUser)(req.params.id);
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.deleteOrganizationUser = deleteOrganizationUser;
