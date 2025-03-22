const axios = require("axios");
const { addToQueue } = require("./producer");
require("dotenv").config();
const API_BASE_URL = process.env.API_BASE_URL;
exports.createStatusUpdate = async (status, description, petitionId) => {
  const statusUpdate = await axios.post(`${API_BASE_URL}/status-updates/`, {
    petitionId: petitionId,
    status: status,
    description: description,
  });
  console.log("✅ Status Update Response", statusUpdate.data);
  const notificationQueueResponse = await addToQueue("NotificationQueue", {
    type: "StatusUpdate",
    value: statusUpdate.data,
  });
  console.log("✅ Notification Queue Response", notificationQueueResponse);
  return statusUpdate.data;
};
