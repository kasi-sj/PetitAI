"use server";

import axios from "axios";
import { addToQueue } from "./notification";

export const petitionStatusUpdate = async (
  petitionId: string,
  status: string,
  description: string,
  reportsTo?: string
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    if (status === "FORWARDED" || status === "DELEGATED") {
      const forwardURL = `${baseUrl}/petitions/${petitionId}/assign`;
      const forwardBody = {
        organizationUserId: reportsTo,
      };
      const forwardResponse = await axios.post(forwardURL, forwardBody);
      if (forwardResponse.status !== 200 && !forwardResponse.data) {
        console.error("❌ Error forwarding the petition", forwardResponse.data);
        return { error: "Error forwarding the petition" };
      }
    }
    const url = `${baseUrl}/status-updates`;
    console.log("URL", url);
    const body = {
      petitionId: petitionId,
      status: status,
      description: description,
    };
    const response = await axios.post(url, body);
    console.log(response.data);

    if (response.status === 200 && response.data) {
      await addToQueue("NotificationQueue", {
        type: "StatusUpdate",
        value: response.data,
      });
    }
    return response.data;
  } catch (error) {
    console.error("❌ Error updating the status of the petition", error);
  }
};
