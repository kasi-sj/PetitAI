import { prisma } from "../config/db";
import { Request, Response } from "express";

// Get all roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

export const isRoleExist = async (roleName: string, organizationId: string) => {
  try {
    const role = await prisma.role.findFirst({
      where: {
        roleName,
        organizationId,
      },
    });
    return role;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get role by ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        organizationUsers: {
          omit: {
            hashedPassword: true,
          },
          include: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.json(role);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

// Create a new role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { organizationId, roleName, priority } = req.body;
    const existingRole = await prisma.role.findUnique({
      where: {
        organizationId_roleName: {
          organizationId,
          roleName,
        },
      },
    });

    if (existingRole) {
      return res
        .status(400)
        .json({ error: "Role already exists for this organization." });
    }

    const role = await prisma.role.create({
      data: {
        organizationId,
        roleName,
        priority,
      },
    });
    res.status(201).json(role);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create role" });
  }
};

// Update an existing role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.update({
      where: { id },
      data: { ...req.body },
    });

    res.json(role);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

// Delete a role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.delete({
      where: { id },
    });

    res.json(role);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete role" });
  }
};

export const getRoleWithLowPriority = async (organizationId: string) => {
  try {
    const lowestRole = await prisma.role.findFirst({
      where: {
        organizationId: organizationId,
      },
      orderBy: {
        priority: "asc",
      },
    });
    return lowestRole;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getRolesByOrganizationId = async (
  organizationId: string,
  limit: number,
  page: number,
  search: string = ""
) => {
  try {
    if (!limit) limit = 10;
    if (!page) page = 1;
    const where = {
      organizationId,
      OR: [{ roleName: { contains: search } }],
    };
    const totalRoles = await prisma.role.count({
      where,
    });
    const totalPages = Math.ceil(totalRoles / limit);
    const roles = await prisma.role.findMany({
      where,
      include: {
        _count: {
          select: {
            organizationUsers: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      totalPages,
      currentPage: page,
      data: roles,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
