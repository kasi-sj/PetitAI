import { Request, Response } from "express";
import * as roleServices from "../services/role.services";

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    await roleServices.getAllRoles(req, res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isRoleExist = async (req: Request, res: Response) => {
  try {
    const { name, organizationId } = req.body;
    const role = await roleServices.isRoleExist(name, organizationId);
    res.json({ role });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    await roleServices.getRoleById(req, res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    await roleServices.createRole(req, res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    await roleServices.updateRole(req, res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    await roleServices.deleteRole(req, res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
