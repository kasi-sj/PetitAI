"use server";
import axios from "axios";
import { getOrganization } from "./organization";

export const getUserRoles = async (
  organizationName: string,
  pageNumber: number,
  search: string
) => {
  const organization = await getOrganization(organizationName);
  const organizationId = organization.id;
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organizations/${organizationId}/roles?page=${pageNumber}&search=${search}`;
  console.log(url);
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  return response.data?.roles;
};

export const checkRoleExists = async (
  organizationId: string,
  searchName: string
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/roles/is-role-exist`;
    const response = await axios.post(
      url,
      {
        name: searchName,
        organizationId,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    console.log("IN ROlE ACTION", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserRoleById = async (roleId: string) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/roles/${roleId}`;
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  return response.data;
};

export const userCustomQuery = async (query: unknown) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/api/user/customQuery/`;
  const response = await axios.post(
    url,
    { query: query },
    { headers: { "Cache-Control": "no-store" } }
  );
  return response.data;
};

export const createUserRole = async (
  organizationId: string,
  roleName: string,
  priority: number
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/roles/`;
    const response = await axios.post(
      url,
      {
        organizationId,
        roleName,
        priority,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
    console.log(response.data);
    return { status: response.status, data: response.data };
  } catch (error) {
    console.log(error);
    return { status: 500, error: "Failed to create role" };
  }
};

export const deleteRole = async (roleId: string) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/roles/${roleId}`;
    const response = await axios.delete(url, {
      headers: { "Cache-Control": "no-store" },
    });
    console.log("DELETE ROLE", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
