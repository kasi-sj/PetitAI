"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const organization_user_1 = require("../validators/organization-user");
const organization_user_controller_1 = require("../controllers/organization-user.controller");
const router = express_1.default.Router();
router.get("/", (0, validateRequest_1.validate)(organization_user_1.getAllOrganizationUsersSchema), organization_user_controller_1.getAllOrganizationUsers);
router.get("/:id", (0, validateRequest_1.validate)(organization_user_1.getOrganizationUserSchema), organization_user_controller_1.getOrganizationUserById);
router.post("/", (0, validateRequest_1.validate)(organization_user_1.createOrganizationUserSchema), organization_user_controller_1.createOrganizationUser);
router.put("/:id", (0, validateRequest_1.validate)(organization_user_1.updateOrganizationUserSchema), organization_user_controller_1.updateOrganizationUser);
router.delete("/:id", (0, validateRequest_1.validate)(organization_user_1.deleteOrganizationUserSchema), organization_user_controller_1.deleteOrganizationUser);
exports.default = router;
