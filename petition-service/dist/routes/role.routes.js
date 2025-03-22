"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const role_1 = require("../validators/role");
const role_controller_1 = require("../controllers/role.controller");
const router = express_1.default.Router();
router.get("/", (0, validateRequest_1.validate)(role_1.getAllRolesSchema), role_controller_1.getAllRoles);
router.get("/:id", (0, validateRequest_1.validate)(role_1.getRoleSchema), role_controller_1.getRoleById);
router.post("/", (0, validateRequest_1.validate)(role_1.createRoleSchema), role_controller_1.createRole);
router.put("/:id", (0, validateRequest_1.validate)(role_1.updateRoleSchema), role_controller_1.updateRole);
router.delete("/:id", (0, validateRequest_1.validate)(role_1.deleteRoleSchema), role_controller_1.deleteRole);
exports.default = router;
