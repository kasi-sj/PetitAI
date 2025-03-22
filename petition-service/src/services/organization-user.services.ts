import { prisma } from "../config/db";

export const getAllOrganizationUsers = async () => {
  return prisma.organizationUser.findMany();
};

export const getOrganizationUserById = async (id: string) => {
  const result = await prisma.organizationUser.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          petitionAssignments: true,
        },
      },
      petitionAssignments: {
        select: {
          petition: {
            select: {
              id: true,
              statusUpdates: true,
            },
          },
        },
      },
      department: {
        select: {
          name: true,
          description: true,
          isRoot: true,
        },
      },
      role: true,
      reportTo: {
        select: {
          id: true,
          name: true,
          imageURL: true,
          isActive: true,
          department: {
            select: {
              name: true,
              description: true,
              isRoot: true,
            },
          },
        },
      },
      subordinates: {
        select: {
          id: true,
          name: true,
          imageURL: true,
          isActive: true,
          department: {
            select: {
              name: true,
              description: true,
              isRoot: true,
            },
          },
        },
      },
      organization: {
        select: {
          name: true,
        }
      }
    },
    omit: {
      hashedPassword: true,
    },
  });
  const map = new Map();
  result?.petitionAssignments.forEach((assignment) => {
    assignment.petition.statusUpdates.forEach((statusUpdate) => {
      map.set(statusUpdate.status, (map.get(statusUpdate.status) || 0) + 1);
    });
  });
  return {
    ...result,
    statusCount: Object.fromEntries(map),
  };
};

export const createOrganizationUser = async (data: {
  organizationId: string;
  departmentId?: string;
  roleId: string;
  reportToId?: string;
  name: string;
  email: string;
  hashedPassword: string;
  imageURL?: string;
  isActive?: boolean;
}) => {
  // Validate Organization ID
  const organization = await prisma.organization.findUnique({
    where: { id: data.organizationId },
  });
  if (!organization) throw new Error("Organization not found.");

  // Validate Role ID
  const role = await prisma.role.findUnique({
    where: { id: data.roleId },
  });
  if (!role) throw new Error("Role not found.");

  // Validate Department ID (if provided)
  if (data.departmentId) {
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId },
    });
    if (!department) throw new Error("Department not found.");
  }

  return prisma.organizationUser.create({ data });
};

export const updateOrganizationUser = async (
  id: string,
  data: Partial<{
    departmentId?: string;
    roleId?: string;
    reportToId?: string;
    name?: string;
    email?: string;
    hashedPassword?: string;
    imageURL?: string;
    isActive?: boolean;
  }>
) => {
  return prisma.organizationUser.update({
    where: { id },
    data,
  });
};

export const deleteOrganizationUser = async (id: string) => {
  return prisma.organizationUser.delete({
    where: { id },
  });
};

export const getAvailableOrganizationUserWithRoleIdAndDepartmentId = async (
  roleId: string,
  departmentId: string
) => {
  try {
    const user = await prisma.organizationUser.findFirst({
      where: { roleId, departmentId },
      include: {
        petitionAssignments: true,
      },
      orderBy: {
        petitionAssignments: {
          _count: "asc",
        },
      },
    });
    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getOrganizationUsersByOrganizationId = async (
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
      OR: [{ name: { contains: search } }, { email: { contains: search } }],
    };

    const totalUsers = await prisma.organizationUser.count({
      where,
    });
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await prisma.organizationUser.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      include: {
        department: true,
        role: true,
        reportTo: true,
        petitionAssignments: {
          select: {
            petition: {
              select: {
                id: true,
                priority: true,
              },
            },
          },
        },
      },
    });

    // Process users to count statuses
    const processedUsers = users.map((user) => {
      const statusCounts: Record<string, number> = {};

      user.petitionAssignments.forEach(({ petition }) => {
        const status = petition.priority;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      return {
        ...user,
        statusCounts,
      };
    });

    return {
      totalPages,
      currentPage: page,
      data: processedUsers,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const isUserExist = async (name: string, organizationId: string) => {
  return prisma.organizationUser.findFirst({
    where: {
      name,
      organizationId,
    },
  });
};

export const getOrganizationUserReportToByRoleId = async (
  roleId: string,
  limit?: number,
  page?: number,
  search: string = ""
) => {
  try {
    const parsedLimit = Number(limit) || 10; // Ensure limit is a valid number
    const parsedPage = Number(page) || 1; // Ensure page is a valid number

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new Error("Invalid role ID");
    }

    const where = {
      role: {
        priority: {
          gt: role.priority,
        },
      },
      OR: [{ name: { contains: search } }],
    };

    const totalUsers = await prisma.organizationUser.count({ where });
    const totalPages = Math.ceil(totalUsers / parsedLimit);

    const reportToUsers = await prisma.organizationUser.findMany({
      where,
      take: parsedLimit, // Ensure this is always a valid number
      skip: (parsedPage - 1) * parsedLimit, // Ensure valid skip calculation
    });

    return {
      totalPages,
      currentPage: parsedPage,
      data: reportToUsers,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const loginOrganizationUser = async (
  name: string,
  password: string,
  organizationId: string
) => {
  const user = await prisma.organizationUser.findFirst({
    where: {
      name,
      hashedPassword: password,
      organizationId,
    },
    include: {
      department: true,
      organization: true,
    },
  });
  if (!user) {
    throw { message: "Invalid email or password" };
  }
  return user;
};

export const getDepartmentUsers = async (
  departmentId: string,
  limit: number,
  page: number,
  search: string = ""
) => {
  try {
    if (!limit) limit = 10;
    if (!page) page = 1;
    const where = {
      departmentId,
      OR: [{ name: { contains: search } }, { email: { contains: search } }],
    };

    const totalUsers = await prisma.organizationUser.count({
      where,
    });
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await prisma.organizationUser.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return {
      totalPages,
      currentPage: page,
      data: users,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
