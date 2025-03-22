import express from "express";
import { validate } from "../middleware/validateRequest";
import {
  createDepartmentSchema,
  deleteDepartmentSchema,
  getAllDepartmentsSchema,
  getAvailableUsersSchema,
  getDepartmentSchema,
  updateDepartmentSchema,
  getOrganizationUsersSchema,
  isDepartmentExistSchema,
} from "../validators/department";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  getAvailableLowLevelUsers,
  getOrganizationUsers,
  isDepartmentExist,
} from "../controllers/department.controller";

const router = express.Router();

router.get("/", validate(getAllDepartmentsSchema), getAllDepartments);

router.get("/:id", validate(getDepartmentSchema), getDepartmentById);

router.post("/", validate(createDepartmentSchema), createDepartment);

router.put("/:id", validate(updateDepartmentSchema), updateDepartment);

router.delete("/:id", validate(deleteDepartmentSchema), deleteDepartment);

router.get(
  "/:id/available-user",
  validate(getAvailableUsersSchema),
  getAvailableLowLevelUsers
);

router.post(
  "/is-department-exist",
  validate(isDepartmentExistSchema),
  isDepartmentExist
);

router.get(
  "/:id/organization-users",
  validate(getOrganizationUsersSchema),
  getOrganizationUsers
);

export default router;
