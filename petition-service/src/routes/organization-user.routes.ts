import express from "express";
import { validate } from "../middleware/validateRequest";
import {
    createOrganizationUserSchema,
    getOrganizationUserSchema,
    getAllOrganizationUsersSchema,
    updateOrganizationUserSchema,
    deleteOrganizationUserSchema,
    isUserExistSchema,
    getReportToUserByRoleIdSchema,
    loginSchema,
    getOrganizationUserPetitionSchema,
} from "../validators/organization-user";
import {
    createOrganizationUser,
    getOrganizationUserById,
    getAllOrganizationUsers,
    updateOrganizationUser,
    deleteOrganizationUser,
    isUserExist,
    getReportToUserByRoleId,
    loginOrganizationUser,
    getOrganizationUserPetition,
} from "../controllers/organization-user.controller";

const router = express.Router();

router.get("/", validate(getAllOrganizationUsersSchema), getAllOrganizationUsers);

router.get("/:id", validate(getOrganizationUserSchema), getOrganizationUserById);

router.post("/", validate(createOrganizationUserSchema), createOrganizationUser);

router.put("/:id", validate(updateOrganizationUserSchema), updateOrganizationUser);

router.delete("/:id", validate(deleteOrganizationUserSchema), deleteOrganizationUser);

router.post("/is-user-exist", validate(isUserExistSchema), isUserExist);

router.get("/report-to/role/:roleId", validate(getReportToUserByRoleIdSchema), getReportToUserByRoleId)

router.post("/login", validate(loginSchema), loginOrganizationUser)

router.get("/:id/petitions", validate(getOrganizationUserPetitionSchema), getOrganizationUserPetition)

export default router;
