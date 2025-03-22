"use server"
import axios from 'axios';


export const getPetition = async (organizationName: string) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/api/petition/organization/${organizationName}`
  const response = await axios.get(url, { headers: { 'Cache-Control': 'no-store' } });
  console.log(response.data)
  return response.data;
};


interface PetitionRequest {
  subject: string;
  body: string;
  userId: string;
  organizationId: string;
}


export const addPetition = async ({ subject, body, userId, organizationId }: PetitionRequest): Promise<void> => {
  const baseUrl = process.env.BACK_END_URL;

  try {
    const queueResponse = await axios.post(`${baseUrl}/queues/add`, {
      topic: "InitializerQueue",
      content: JSON.stringify({
        organizationId,
        userId,
        subject,
        body
      })
    });
    console.log("✅ Request added to queue:", queueResponse.data);
  } catch (error) {
    console.error("❌ Error adding request to queue:", error);
  }
}

export const getPetitionsById = async (petitionId: string) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/petitions/${petitionId}`
  const response = await axios.get(url, { headers: { 'Cache-Control': 'no-store' } });
  console.log(response.data)
  return response.data;
};

export const getMostSimilarPetitions = async (petitionId: string) => {
  const baseUrl = process.env.BACK_END_URL;
  const url = `${baseUrl}/petitions/${petitionId}/getSimilarPetitions`
  const response = await axios.get(url, { headers: { 'Cache-Control': 'no-store' } });
  console.log(response.data)
  return response.data;
}

export const getPetitionsCount = async (organizationId: string, departmentId: string | null, organizationUserId: null | string, from: string | null, to: string | null) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    let url = `${baseUrl}/organizations/${organizationId}/petitions-count`
    const query: { name: string; value: string }[] = []
    if (from) {
      query.push({
        name: "from",
        value: from
      })
    }
    if (to) {
      query.push({
        name: "to",
        value: to
      })
    }
    if (departmentId) {
      query.push({
        name: "departmentId",
        value: departmentId
      })
    }
    if (organizationUserId) {
      query.push({
        name: "organizationUserId",
        value: organizationUserId
      })
    }
    if (query.length > 0) {
      url += '?' + query.map(q => `${q.name}=${encodeURIComponent(q.value)}`).join('&');
    }
    const response = await axios.get(url, { headers: { 'Cache-Control': 'no-store' } });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("❌ Error getting petition count:", error);
  }
}


export const getPetitionsCountByDepartment = async (organizationId: string) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/organizations/${organizationId}/petitions-count-by-department`
    const response = await axios.get(url, { headers: { 'Cache-Control': 'no-store' } });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("❌ Error getting petition count by department:", error);
  }
}