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
exports.deleteOrganization = exports.updateOrganization = exports.createOrganization = exports.getOrganizationById = exports.getAllOrganizations = void 0;
const db_1 = require("../config/db");
const getAllOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizations = yield db_1.prisma.organization.findMany();
        res.json(organizations);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching organizations", error });
    }
});
exports.getAllOrganizations = getAllOrganizations;
const getOrganizationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const organization = yield db_1.prisma.organization.findUnique({
            where: { id },
        });
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        res.json(organization);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching organization", error });
    }
});
exports.getOrganizationById = getOrganizationById;
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, imageURL, description, website, phoneNumber, address, establishedYear, email } = req.body;
        const organization = yield db_1.prisma.organization.create({
            data: {
                name,
                imageURL,
                description,
                website,
                phoneNumber,
                address,
                establishedYear,
                email,
            },
        });
        res.status(201).json(organization);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating organization", error });
    }
});
exports.createOrganization = createOrganization;
const updateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const organization = yield db_1.prisma.organization.update({
            where: { id },
            data: Object.assign({}, req.body),
        });
        res.json(organization);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating organization", error });
    }
});
exports.updateOrganization = updateOrganization;
const deleteOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prisma.organization.delete({
            where: { id },
        });
        res.json({ message: "Organization deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting organization", error });
    }
});
exports.deleteOrganization = deleteOrganization;
