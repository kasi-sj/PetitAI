"use server";
import axios from "axios";
import { getOrganization } from "./organization";

export const getOrganizationUsers = async (
  organizationName: string,
  pageNumber: number,
  search: string
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const organization = await getOrganization(organizationName);
    const organizationId = organization.id;
    const url = `${baseUrl}/organizations/${organizationId}/organization-users/?page=${pageNumber}&search=${search}`;
    const response = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getReportTo = async (
  roleId: string,
  pageNumber: number,
  search: string
) => {
  if (!roleId) {
    return [];
  }

  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organization-users/report-to/role/${roleId}?page=${pageNumber}&search=${search}`;
  console.log("Report url ", url);
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  console.log(response.data?.reportToUsers);
  return response.data?.data;
};

export const putOrganizationUser = async (organizationUser: {
  organizationId: string;
  departmentId: string | undefined;
  roleId: string;
  reportToId: string | undefined;
  name: string;
  hashedPassword: string;
  isActive: boolean;
}) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organization-users/`;
  console.log("organizationUser", url, organizationUser);
  try {
    const response = await axios.post(url, organizationUser, {
      headers: { "Cache-Control": "no-store" },
    });
    console.log("user updated", response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const checkUserExist = async (
  organizationName: string,
  name: string
) => {
  const organization = await getOrganization(organizationName);
  const organizationId = organization.id;
  const baseUrl = process.env.BACK_END_URL;
  const body = {
    organizationId: organizationId,
    name: name,
  };
  const url = `${baseUrl}/organization-users/is-user-exist`;
  const response = await axios.post(url, body, {
    headers: { "Cache-Control": "no-store" },
  });
  return response.data;
};

export const getOrganizationUser = async (organizationUserId: string) => {
  if (!organizationUserId) {
    return null;
  }
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organization-users/${organizationUserId}`;
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  console.log("organizationuser", response.data);
  return response.data;
};

export const loginOrganizationUser = async (
  organizationId: string,
  name: string,
  password: string
) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organization-users/login`;
  try {
    console.log([name, password, organizationId]);

    const response = await axios.post(
      url,
      { name, password, organizationId },
      { headers: { "Cache-Control": "no-store" } }
    );
    return response.data?.user;
  } catch (e) {
    console.log("error", e);
  }
};

export const getOrganizationUserPetitions = async (
  organizationUserId: string,
  isPending: boolean,
  page: number
) => {
  const baseUrl = process.env.BACK_END_URL;
  let url = `${baseUrl}/organization-users/${organizationUserId}/petitions?page=${page}`;
  if (isPending) {
    url += `&isPending=${isPending}`;
  }
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  return response.data;
};

export const getAdminUserPetitions = async (
  adminUserId: string,
  isPending: boolean,
  page: number
) => {
  const baseUrl = process.env.BACK_END_URL;
  let url = `${baseUrl}/users/${adminUserId}/petitions/admin?page=${page}`;
  if (isPending) {
    url += `&isPending=${isPending}`;
  }
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  return response.data;
};
export const getOrganizationUserByDepartment = async (
  departmentId: string,
  search: string
) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/departments/${departmentId}/organization-users?search=${search}`;
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  console.log("dept-users", response.data);
  return response.data;
};

export const deleteOrganizationUser = async (organizationUserId: string) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organization-users/${organizationUserId}`;
  const response = await axios.delete(url, {
    headers: { "Cache-Control": "no-store" },
  });
  console.log("DELETE", response.data);
  return response.data;
};

export const updateOrganizationUser = async (organizationUser: {
  userId: string;
  organizationId: string;
  departmentId: string | undefined;
  roleId: string;
  reportToId: string | undefined;
  name: string;
  isActive: boolean;
  email: string | undefined;
}) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/organization-users/${organizationUser.userId}`;
    const body = {
      departmentId: organizationUser.departmentId || undefined,
      roleId: organizationUser.roleId || undefined,
      reportToId: organizationUser.reportToId || undefined,
      name: organizationUser.name || undefined,
      isActive: organizationUser.isActive || undefined,
      email: organizationUser.email || undefined,
    };
    console.log("Before UPDATE USER", url, body);
    const response = await axios.put(url, body, {
      headers: { "Cache-Control": "no-store" },
    });
    console.log("UPDATED USER", response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
