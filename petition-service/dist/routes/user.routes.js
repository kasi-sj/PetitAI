"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const user_1 = require("../validators/user");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/", (0, validateRequest_1.validate)(user_1.getAllUsersSchema), user_controller_1.getAllUsers);
router.get("/:id", (0, validateRequest_1.validate)(user_1.getUserSchema), user_controller_1.getUserById);
router.post("/", (0, validateRequest_1.validate)(user_1.createUserSchema), user_controller_1.createUser);
router.put("/:id", (0, validateRequest_1.validate)(user_1.updateUserSchema), user_controller_1.updateUser);
router.delete("/:id", (0, validateRequest_1.validate)(user_1.deleteUserSchema), user_controller_1.deleteUser);
exports.default = router;
