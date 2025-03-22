import express from "express";
import { validate } from "../middleware/validateRequest";
import {
  createRoleSchema,
  deleteRoleSchema,
  getAllRolesSchema,
  getRoleSchema,
  isRoleExists,
  updateRoleSchema,
} from "../validators/role";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  isRoleExist,
  updateRole,
} from "../controllers/role.controller";

const router = express.Router();

router.get("/", validate(getAllRolesSchema), getAllRoles);

router.get("/:id", validate(getRoleSchema), getRoleById);

router.post("/", validate(createRoleSchema), createRole);

router.put("/:id", validate(updateRoleSchema), updateRole);

router.delete("/:id", validate(deleteRoleSchema), deleteRole);

router.post("/is-role-exist", validate(isRoleExists), isRoleExist);

export default router;
