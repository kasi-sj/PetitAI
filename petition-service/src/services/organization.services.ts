import { z } from "zod";
import { prisma } from "../config/db";
import { Request, Response } from "express";
import {
  getAllOrganizationsSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
} from "../validators/organization";

export const getAllOrganizations = async (
  req: z.infer<typeof getAllOrganizationsSchema>,
  res: Response
) => {
  try {
    var { limit, page, search } = req.query;
    if (!limit) limit = 10;
    if (!page) page = 1;
    if (!search) search = "";
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching organizations", error });
  }
};

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error fetching organization", error });
  }
};

export const createOrganization = async (
  req: z.infer<typeof createOrganizationSchema>,
  res: Response
) => {
  try {
    const {
      establishedYear,
      name,
      similarityThreshold,
      userId,
      address,
      departments,
      description,
      email,
      imageURL,
      phoneNumber,
      website,
    } = req.body;
    const updatedOrganizationUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isSetUpCompleted: true,
        isAdmin: true,
      },
    });
    const organization = await prisma.organization.create({
      data: {
        name,
        establishedYear:
          typeof establishedYear === "string"
            ? parseInt(establishedYear)
            : establishedYear,
        isActive: true,
        similarityThreshold,
        address,
        description,
        email,
        imageURL,
        phoneNumber,
        website,
        adminId: userId,
      },
    });
    const lowerLevelRole = await prisma.role.create({
      data: {
        priority: 0,
        organizationId: organization?.id,
        roleName: "Lower Level",
      },
    });
    const higherLevelRole = await prisma.role.create({
      data: {
        priority: 100,
        organizationId: organization?.id,
        roleName: "Higher Level",
      },
    });
    const organizationDepartments = [];
    const organizationUsers = [];
    if (departments) {
      const rootOrganizationDepartment = await prisma.department.create({
        data: {
          name: "Root Department",
          description:
            "This is a root department which does not handle any request used for hiararchy",
          organizationId: organization.id,
          isRoot: true,
        },
      });
      organizationDepartments.push(rootOrganizationDepartment);
      organizationUsers.push(
        await prisma.organizationUser.create({
          data: {
            name: `Root User`,
            organizationId: organization.id,
            hashedPassword: "securePassword123",
            roleId: higherLevelRole.id,
            departmentId: rootOrganizationDepartment.id,
          },
        })
      );
      for (const department of departments) {
        const newDepartment = await prisma.department.create({
          data: {
            name: department.name,
            description: department.description,
            organizationId: organization.id,
            isRoot: false,
          },
        });
        organizationDepartments.push(newDepartment);
        organizationUsers.push(
          await prisma.organizationUser.create({
            data: {
              name: `${department.name} - Default Handler`,
              organizationId: organization.id,
              hashedPassword: "securePassword123",
              roleId: lowerLevelRole.id,
              departmentId: newDepartment.id,
            },
          })
        );
      }
    }
    res.json({
      organization,
      organizationDepartments,
      organizationUsers,
      lowerLevelRole,
      higherLevelRole,
      updatedOrganizationUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating organization", error });
  }
};

export const updateOrganization = async (req: z.infer<typeof updateOrganizationSchema>, res: Response) => {
  try {
    const { id } = req.params;
    const { whitelistedEmails, ...rest } = req.body
    await prisma.whitelistedEmail.deleteMany({
      where : {
        organizationId : id
      }
    })
    await prisma.whitelistedEmail.createMany({
      data: whitelistedEmails?.map((data: {email : string}) => ({ ...data, organizationId: id })) || []
    })
    const organization = await prisma.organization.update({
      where: { id },
      data: { ...rest },
    });
    res.json(organization);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error updating organization", error });
  }
};

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.organization.delete({
      where: { id },
    });

    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting organization", error });
  }
};

export const getOrganizationByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const organization = await prisma.organization.findFirst({
      where: { name },
      include: {
        _count: {
          select: { petitions: true, departments: true, users: true },
        },
        whitelistedEmails: true
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error fetching organization", error });
  }
};

export const getOrganizationWhereUserDonePetitions = async (userId: string) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        petitions: {
          some: {
            fromUserId: userId,
          },
        },
      },
    });
    return organizations;
  } catch (error) {
    return [];
  }
};
