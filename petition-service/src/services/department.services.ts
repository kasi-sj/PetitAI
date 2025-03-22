import { prisma } from "../config/db";

export const getAllDepartments = async (includeRoot: boolean) => {
  if (includeRoot) {
    return await prisma.department.findMany({});
  } else {
    return await prisma.department.findMany({ where: { isRoot: false } });
  }
};

export const getDepartmentById = async (id: string) => {
  return await prisma.department.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          petitions: true,
          users: true,
        },
      },
      users: {
        select: {
          id: true,
          email: true,
          role: true,
          imageURL: true,
        },
      },
    },
  });
};

export const isDepartmentExist = async (
  name: string,
  organizationId: string
) => {
  return await prisma.department.findFirst({
    where: {
      name,
      organizationId,
    },
  });
};

export const createDepartment = async (data: {
  organizationId: string;
  name: string;
  description?: string;
  isRoot?: boolean;
  users?: string[];
}) => {
  try {
    const existingDepartment = await prisma.department.findFirst({
      where: {
        organizationId: data.organizationId,
        name: data.name,
      },
    });

    if (existingDepartment) {
      throw new Error(
        "A department with this name already exists in the organization."
      );
    }

    const departmentData = {
      organizationId: data.organizationId,
      name: data.name,
      description: data.description,
      isRoot: data.isRoot,
    };
    const res = await prisma.department.create({ data: departmentData });

    if (data.users && data.users.length > 0) {
      await prisma.organizationUser.updateMany({
        where: {
          id: { in: data.users },
        },
        data: {
          departmentId: res.id,
        },
      });
    }
    return res;
  } catch (e: any) {
    throw e;
  }
};

export const updateDepartment = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    isRoot?: boolean;
    usersToRemove: string[];
    usersToAdd: string[];
  }
) => {
  const departmentData = {
    name: data.name,
    description: data.description,
    isRoot: data.isRoot,
  };
  const res = await prisma.department.update({
    where: { id },
    data: departmentData,
  });
  if (data?.usersToRemove?.length > 0) {
    await prisma.organizationUser.updateMany({
      where: {
        id: { in: data.usersToRemove },
      },
      data: {
        departmentId: null,
      },
    });
  }
  if (data?.usersToAdd?.length > 0) {
    await prisma.organizationUser.updateMany({
      where: {
        id: { in: data.usersToAdd },
      },
      data: {
        departmentId: id,
      },
    });
  }
  return res;
};

export const deleteDepartment = async (id: string) => {
  return await prisma.department.delete({
    where: { id },
  });
};

export const getDepartmentsByOrganizationId = async (
  organizationId: string,
  limit: number,
  page: number,
  search: string = "",
  pagination: string = ""
) => {
  if (!pagination) {
    return await prisma.department.findMany({
      where: {
        organizationId,
      },
    });
  }
  if (!limit) limit = 10;
  if (!page) page = 1;
  const where = {
    organizationId,
    OR: [{ name: { contains: search } }],
  };
  const totalUsers = await prisma.department.count({
    where,
  });
  const totalPages = Math.ceil(totalUsers / limit);
  const users = await prisma.department.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    include: {
      _count: {
        select: {
          petitions: true,
          users: true,
        },
      },
    },
  });
  return {
    totalPages,
    currentPage: page,
    data: users,
  };
};
