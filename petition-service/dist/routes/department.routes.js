"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const department_1 = require("../validators/department");
const department_controller_1 = require("../controllers/department.controller");
const router = express_1.default.Router();
router.get("/", (0, validateRequest_1.validate)(department_1.getAllDepartmentsSchema), department_controller_1.getAllDepartments);
router.get("/:id", (0, validateRequest_1.validate)(department_1.getDepartmentSchema), department_controller_1.getDepartmentById);
router.post("/", (0, validateRequest_1.validate)(department_1.createDepartmentSchema), department_controller_1.createDepartment);
router.put("/:id", (0, validateRequest_1.validate)(department_1.updateDepartmentSchema), department_controller_1.updateDepartment);
router.delete("/:id", (0, validateRequest_1.validate)(department_1.deleteDepartmentSchema), department_controller_1.deleteDepartment);
exports.default = router;
