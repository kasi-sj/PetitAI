"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const organization_1 = require("../validators/organization");
const organization_controller_1 = require("../controllers/organization.controller");
const router = express_1.default.Router();
router.get("/", (0, validateRequest_1.validate)(organization_1.getAllOrganizationsSchema), organization_controller_1.getAllOrganizations);
router.get("/:id", (0, validateRequest_1.validate)(organization_1.getOrganizationSchema), organization_controller_1.getOrganizationById);
router.post("/", (0, validateRequest_1.validate)(organization_1.createOrganizationSchema), organization_controller_1.createOrganization);
router.put("/:id", (0, validateRequest_1.validate)(organization_1.updateOrganizationSchema), organization_controller_1.updateOrganization);
router.delete("/:id", (0, validateRequest_1.validate)(organization_1.deleteOrganizationSchema), organization_controller_1.deleteOrganization);
router.get("/:id/departments", (0, validateRequest_1.validate)(organization_1.getOrganizationDepartmentsSchema), organization_controller_1.getOrganizationDepartments);
exports.default = router;
