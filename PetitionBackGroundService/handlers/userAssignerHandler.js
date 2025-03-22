const axios = require("axios");
const { createStatusUpdate } = require("../utils");
const API_BASE_URL = process.env.API_BASE_URL;
module.exports = async (message) => {
  try {
    const parsedMessage =
      typeof message === "string" ? JSON.parse(message) : message;
    console.log(parsedMessage, "Processing user assigner queue");
    const { petitionId } = parsedMessage;
    const petition = (
      await axios.get(`${API_BASE_URL}/petitions/${petitionId}`)
    ).data;
    const departmentId = petition?.departmentId;
    if (!departmentId) {
      console.log("No department id for the petition in userAssigner");
      return;
    }
    const orgUser = (
      await axios.get(
        `${API_BASE_URL}/departments/${departmentId}/available-user`
      )
    ).data?.organizationUser;
    if (!orgUser) {
      console.log("No user available for the department");
      return;
    }
    console.log(orgUser);
    const assignMentPayload = { organizationUserId: orgUser.id };
    const assignmentResponse = (
      await axios.post(
        `${API_BASE_URL}/petitions/${petitionId}/assign`,
        assignMentPayload
      )
    ).data;
    
    console.log("✅ User Assigner Response:", assignmentResponse);
    const organizationUserName = orgUser.name;
    const organizationUserEmail = orgUser.email;
    const assignmentStatusUpdateResponse = await createStatusUpdate(
      "ASSIGNED",
      `Your petition has been assigned to ${organizationUserName} (${organizationUserEmail}) for further review and processing.`,
      petitionId
    );
    console.log("✅ Assignment status update", assignmentStatusUpdateResponse);
  } catch (error) {
    console.error("❌ User Assigner message:", error.message);
  }
};
