import express from "express";
import { validate } from "../middleware/validateRequest";
import { createUserSchema, deleteUserSchema, getAllUsersSchema, getOrganizationPetition, getUserOrganizationsSchema, getUserPetitionsSchema, getUserSchema, updateUserSchema } from "../validators/user";
import { createUser, deleteUser, getAdminOrganizationPetition, getAllUsers, getUserById, getUserOrganizations, getUserPetitions, updateUser } from "../controllers/user.controller";

const router = express.Router();

router.get("/", validate(getAllUsersSchema), getAllUsers);

router.get("/:id", validate(getUserSchema), getUserById);

router.post("/", validate(createUserSchema), createUser);

router.put("/:id", validate(updateUserSchema), updateUser);

router.delete("/:id", validate(deleteUserSchema), deleteUser);

router.get("/:id/organizations", validate(getUserOrganizationsSchema) , getUserOrganizations);

router.get("/:id/petitions", validate(getUserPetitionsSchema) , getUserPetitions);

router.get("/:id/petitions/admin", validate(getOrganizationPetition) , getAdminOrganizationPetition);

export default router;
