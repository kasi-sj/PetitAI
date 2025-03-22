const axios = require("axios");
const { createStatusUpdate } = require("../utils");
require("dotenv").config();

const API_BASE_URL = process.env.API_BASE_URL;
module.exports = async (message) => {
  console.log("Processing repetitive queue", message);
  try {
    const parsedMessage =
      typeof message === "string" ? JSON.parse(message) : message;

    const { reason, departmentId, organizationId, petitionDetails, severity } =
      parsedMessage;
    const { id: petitionId } = petitionDetails;

    const organization = (
      await axios.get(`${API_BASE_URL}/organizations/${organizationId}`)
    ).data;
    const department = (
      await axios.get(`${API_BASE_URL}/departments/${departmentId}`)
    ).data;
    const petition = (
      await axios.get(`${API_BASE_URL}/petitions/${petitionId}`)
    ).data;
    const tag = `${organization.name} ${department.name}`;
    const text = `${petition.subject} ${petition.body}`;
    console.log(tag);
    console.log(text);
    const mostSimilar = (
      await axios.post(`${API_BASE_URL}/petitions/most-similar`, {
        text: text,
        tag: tag,
      })
    ).data;
    var threshold = organization.similarityThreshold;
    if (!threshold) threshold = 1;
    threshold = threshold / 100;
    petition.priority = (severity || "").toUpperCase();
    petition.departmentId = departmentId;
    petition.tag = tag;
    console.log(organization);
    console.log(department);
    console.log(petition);
    console.log(mostSimilar);
    console.log(threshold);
    const updatedPetitionResponse = (
      await axios.put(`${API_BASE_URL}/petitions/${petitionId}`, petition)
    ).data;
    console.log(updatedPetitionResponse);
    const categoryAssignedStatusUpdate = await createStatusUpdate(
      "CATEGORY_ASSIGNED",
      `Your petition has been successfully categorized and is now ready for the next steps in the review process. reason: ${reason}`,
      petitionId
    );

    console.log(
      "✅ Category assigned Status Update Response",
      categoryAssignedStatusUpdate
    );

    var similarityResult;
    if (mostSimilar && mostSimilar[0]?.similarity) {
      similarityResult = mostSimilar[0].similarity;
    }
    if (similarityResult && similarityResult > threshold) {
      const repeatedRejectionStatusUpdate = createStatusUpdate(
        "REPEATED_REJECTION",
        "Your petition has been rejected due to its similarity to a previously submitted petition. Petitions that closely resemble existing ones do not meet the submission criteria.",
        petitionId
      );
      return;
    }
    const userAssignerQueueResponse = await axios.post(
      `${API_BASE_URL}/queues/add`,
      {
        topic: "UserAssignerQueue",
        content: JSON.stringify({
          petitionId: petitionId,
        }),
      }
    );
    console.log(
      "✅ User Assigner Queue Response",
      userAssignerQueueResponse.data
    );
  } catch (error) {
    console.error("❌ Repetitive message:", error.message);
  }
  // Add processing logic here...
};
