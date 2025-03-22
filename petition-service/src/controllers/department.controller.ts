import { prisma } from "../config/db";
import { Request, Response } from "express";
import * as departmentServices from "../services/department.services";
import { getRoleWithLowPriority } from "../services/role.services";
import {
  getAvailableOrganizationUserWithRoleIdAndDepartmentId,
  getDepartmentUsers,
} from "../services/organization-user.services";
import { getOrganizationUsersSchema } from "../validators/department";
import { z } from "zod";

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const { includeRoot } = req.query;
    const departments = await departmentServices.getAllDepartments(
      !!includeRoot
    );
    res.json(departments);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const isDepartmentExist = async (req: Request, res: Response) => {
  try {
    const { name, organizationId } = req.body;
    const department = await departmentServices.isDepartmentExist(
      name,
      organizationId
    );
    res.json({ department });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const department = await departmentServices.getDepartmentById(
      req.params.id
    );
    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }
    res.json(department);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentServices.createDepartment(req.body);

    // Explicitly return status and data
    res.status(201).json({
      status: 201,
      data: department,
      message: "Department created successfully",
    });
  } catch (error: any) {
    console.log("❌ Backend Error:", error);
    res.status(400).json({
      status: 400,
      message: error.message || "Something went wrong",
    });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const department = await departmentServices.updateDepartment(
      req.params.id,
      req.body
    );
    res.json(department);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    await departmentServices.deleteDepartment(req.params.id);
    res.json({ message: "Department deleted successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getAvailableLowLevelUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const organizationId = await getOrganizationIdFromDepartmentId(id);
    if (!organizationId) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }
    // getting role with low priority
    const role = await getRoleWithLowPriority(organizationId);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }
    const user = await getAvailableOrganizationUserWithRoleIdAndDepartmentId(
      role.id,
      id
    );
    res.json({ organizationUser: user });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const getOrganizationIdFromDepartmentId = async (
  departmentId: string
) => {
  try {
    return (
      await prisma.department.findUnique({
        where: {
          id: departmentId,
        },
        select: {
          organizationId: true,
        },
      })
    )?.organizationId;
  } catch {
    return null;
  }
};

export const getOrganizationUsers = async (
  req: z.infer<typeof getOrganizationUsersSchema>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { limit, page, search } = req.query;
    const users = await getDepartmentUsers(
      id,
      Number(limit),
      Number(page),
      search
    );
    res.json({ users });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
