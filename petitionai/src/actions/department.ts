"use server";
import axios from "axios";
import { getOrganization } from "./organization";

export const getDepartments = async (
  organizationName: string | null,
  pageNumber: number,
  search: string
) => {
  try {
    if (!organizationName) {
      return {};
    }
    const organization = await getOrganization(organizationName);
    console.log("organization", organization);
    const organizationId = organization.id;
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/organizations/${organizationId}/departments?page=${pageNumber}&search=${search}&pagination=true`;
    const response = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data?.departments;
  } catch (error) {
    console.error(error);
  }
};

export const checkDepartmentExists = async (
  organizationId: string,
  searchName: string
) => {
  console.log("IN BACKEND", searchName, organizationId);
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/departments/is-department-exist`;
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
    console.log("DEPARTMENT EXISTS", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDepartmentById = async (departmentId: string) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/departments/${departmentId}`;
    const response = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createDepartment = async (
  organizationId: string,
  name: string,
  description?: string,
  users?: string[]
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    if (!baseUrl) {
      throw new Error("BACK_END_URL is not defined");
    }

    const url = `${baseUrl}/departments`;

    const response = await axios.post(url, {
      name,
      description,
      organizationId,
      users,
    });
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteDepartment = async (departmentId: string) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/departments/${departmentId}`;
    console.log("HI URL", url);
    const response = await axios.delete(url, {
      headers: { "Cache-Control": "no-store" },
    });
    console.log("DELETE", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateDepartment = async (department: {
  id: string;
  name: string;
  description: string;
  usersToRemove: string[];
  usersToAdd: string[];
}) => {
  try {
    console.log("DEPARTMENT", department);
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/departments/${department.id}`;
    const body = {
      name: department.name || undefined,
      description: department.description || undefined,
      usersToRemove: department.usersToRemove || undefined,
      usersToAdd: department.usersToAdd || undefined,
    };
    const response = await axios.put(url, body, {
      headers: { "Cache-Control": "no-store" },
    });
    console.log("UPDATE Department", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
