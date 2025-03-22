"use server";
// http://localhost:4000/users/8a162724-9fc7-40e7-8d20-c3b4d9b7aade/organizations
// http://localhost:4000/users/8a162724-9fc7-40e7-8d20-c3b4d9b7aade/petitions?organization=DynamicCorp

import axios from "axios";

export const getUser = async (userId: string) => {
  try {
    if (!userId) {
      return null;
    }

    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/users/${userId}`;
    console.log([url, userId]);
    const response = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    });
    console.log("users", response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getUserOrganizations = async (userId: string) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/users/${userId}/organizations`;
    const response = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getPetitions = async (
  userId: string,
  organization: string | null,
  page: number
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    let url = `${baseUrl}/users/${userId}/petitions?page=${page}`;
    if (organization) {
      url += `&organization=${organization}`;
    }
    console.log(url);
    const response = await axios.get(url, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

// export const getUserByToken = async (token : string) => {
//     try {
//         const url = `${process.env.BACK_END_AUTH_URL}/user`

//     }
// }

export const updateUserSetUp = async (userId: string) => {
  try {
    const url = `${process.env.BACK_END_URL}/users/${userId}`;
    const body = {
      isAdmin: false,
      isSetUpCompleted: true,
    };
    console.log(url);
    const response = await axios.put(url, body, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};


export const updateUser = async (userId: string, data: {
  name: string,
  email: string,
  dob?: string,
  gender?: string,
  profilePic?: string,
  address?: string,
  phoneNo?: string,
  bio?: string,
  isActive?: boolean,
}) => {
  try {
    const newData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value === "" ? undefined : value])
    );
    if (newData.dob) {
      if (typeof newData.dob === 'string') {
        newData.dob = new Date(newData.dob).toISOString();
      }
    }
    const url = `${process.env.BACK_END_URL}/users/${userId}`;
    const response = await axios.put(url, newData, {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}