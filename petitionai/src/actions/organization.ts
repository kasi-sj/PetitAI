"use server";
import axios from "axios";

export const getOrganization = async (organizationName: string) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/organizations/name/${organizationName}`;
  console.log(url);
  const response = await axios.get(url, {
    headers: { "Cache-Control": "no-store" },
  });
  console.log("organization", response.data);
  return response.data;
};

export const getOrganizations = async (search = "") => {
  const baseUrl = process.env.BACK_END_URL;
  const response = await fetch(`${baseUrl}/organizations/?search=${search}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch organizations");
  return response.json();
};

export const createOrganizations = async (body: unknown) => {
  const baseUrl = process.env.BACK_END_URL;
  const response = await axios.post(`${baseUrl}/organizations/`, body);
  console.log("organization", response.data);
  return response.data;
};

export const updateOrganization = async (id: string, body: unknown) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const response = await axios.put(`${baseUrl}/organizations/${id}`, body);
    console.log("response organization", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrganizationById = async (id: string) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const response = await axios.get(`${baseUrl}/organizations/${id}`);
    console.log("organization", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
