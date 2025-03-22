import axios from "axios";

export const addToQueue = async (
  queue: string,
  content: { type: string; value: string }
) => {
  try {
    const baseUrl = process.env.BACK_END_URL;
    const url = `${baseUrl}/queues/add`;
    const body = {
      topic: queue,
      content: JSON.stringify(content),
    };
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error("❌ Error adding request to queue:", error);
  }
};
