import express from "express";
import { validate } from "../middleware/validateRequest";
import { assignPetitionToOrgUserSchema, createPetitionSchema, deletePetitionSchema, getAllPetitionsSchema, getMostSimilarPetitionSchema, getMostSimilarPetitionsSchema, getPetitionSchema, updatePetitionSchema } from "../validators/petition";
import { assignPetitionToOrgUser, createPetition, deletePetition, getAllPetitions, getMostSimilarPetition, getPetitionById, getSimilarPetitions, updatePetition } from "../controllers/petition.controller";

const router = express.Router();

router.get("/", validate(getAllPetitionsSchema), getAllPetitions);

router.get("/:id", validate(getPetitionSchema), getPetitionById);

router.post("/", validate(createPetitionSchema), createPetition);

router.put("/:id", validate(updatePetitionSchema), updatePetition);

router.delete("/:id", validate(deletePetitionSchema), deletePetition);

router.post("/most-similar", validate(getMostSimilarPetitionSchema),getMostSimilarPetition);

router.post("/:id/assign", validate(assignPetitionToOrgUserSchema) ,assignPetitionToOrgUser)

router.get("/:id/getSimilarPetitions" , validate(getMostSimilarPetitionsSchema) , getSimilarPetitions)

export default router;
