import express from "express";
import { validate } from "../middleware/validateRequest";
import {
  createOrganizationSchema,
  deleteOrganizationSchema,
  getAllOrganizationsSchema,
  getOrganizationByNameSchema,
  getOrganizationDepartmentsSchema,
  getOrganizationRolesSchema,
  getOrganizationSchema,
  getOrganizationUsersSchema,
  getPetitionCountByDepartmentSchema,
  getPetitionCountSchema,
  updateOrganizationSchema,
} from "../validators/organization";

import {
  createOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationRoles,
  getOrganizationById,
  getOrganizationByName,
  getOrganizationDepartments,
  updateOrganization,
  getOrganizationUsers,
  getPetitionCount,
  getPetitionCountByDepartment,
} from "../controllers/organization.controller";

const router = express.Router();

router.get("/", validate(getAllOrganizationsSchema), getAllOrganizations);

router.get("/:id", validate(getOrganizationSchema), getOrganizationById);

router.post("/", validate(createOrganizationSchema), createOrganization);

router.put("/:id", validate(updateOrganizationSchema), updateOrganization);

router.delete("/:id", validate(deleteOrganizationSchema), deleteOrganization);

router.get(
  "/:id/departments",
  validate(getOrganizationDepartmentsSchema),
  getOrganizationDepartments
);

router.get(
  "/:id/roles",
  validate(getOrganizationRolesSchema),
  getOrganizationRoles
);

router.get(
  "/:id/organization-users",
  validate(getOrganizationUsersSchema),
  getOrganizationUsers
);

router.get(
  "/name/:name",
  validate(getOrganizationByNameSchema),
  getOrganizationByName
);

router.get(
  "/:id/petitions-count",
  validate(getPetitionCountSchema),
  getPetitionCount
);

router.get(
  "/:id/petitions-count-by-department",
  validate(getPetitionCountByDepartmentSchema),
  getPetitionCountByDepartment
);

export default router;
