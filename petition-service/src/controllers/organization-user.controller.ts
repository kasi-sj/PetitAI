import { Request, Response } from "express";
import {
  getAllOrganizationUsers as getAllService,
  getOrganizationUserById as getByIdService,
  createOrganizationUser as createService,
  updateOrganizationUser as updateService,
  deleteOrganizationUser as deleteService,
  isUserExist as isUserExistService,
  getOrganizationUserReportToByRoleId,
} from "../services/organization-user.services";
import {
  getOrganizationUserPetitionSchema,
  getReportToUserByRoleIdSchema,
  isUserExistSchema,
  loginSchema,
} from "../validators/organization-user";
import * as OrganizationUserServices from "../services/organization-user.services";
import * as PetitionServices from "../services/petition.services";
import { z } from "zod";

export const getAllOrganizationUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllService();
    res.json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationUserById = async (req: Request, res: Response) => {
  try {
    const user = await getByIdService(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createOrganizationUser = async (req: Request, res: Response) => {
  try {
    const user = await createService(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateOrganizationUser = async (req: Request, res: Response) => {
  try {
    const user = await updateService(req.params.id, req.body);
    res.json(user);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrganizationUser = async (req: Request, res: Response) => {
  try {
    await deleteService(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isUserExist = async (
  req: z.infer<typeof isUserExistSchema>,
  res: Response
) => {
  try {
    const { name, organizationId } = req.body;
    const user = await isUserExistService(name, organizationId);
    res.json(user);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

export const getReportToUserByRoleId = async (
  req: z.infer<typeof getReportToUserByRoleIdSchema>,
  res: Response
) => {
  try {
    const { roleId } = req.params;
    const { limit, page, search } = req.query;

    const reportToUsers = await getOrganizationUserReportToByRoleId(
      roleId,
      Number(limit),
      Number(page),
      search as string
    );

    res.json(reportToUsers);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const loginOrganizationUser = async (
  req: z.infer<typeof loginSchema>,
  res: Response
) => {
  try {
    const { name, password, organizationId } = req.body;
    const user = await OrganizationUserServices.loginOrganizationUser(
      name,
      password,
      organizationId
    );
    res.status(200).json({ user });
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};

export const getOrganizationUserPetition = async (
  req: z.infer<typeof getOrganizationUserPetitionSchema>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { isPending, limit, page } = req.query;
    const petitionAssignments =
      await PetitionServices.getOrganizationUserPetitions(
        id,
        isPending,
        limit || "10",
        page || "1"
      );
    res.json({ ...petitionAssignments });
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
};
