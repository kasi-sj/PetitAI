const axios = require("axios");
const { addToQueue } = require("../producer");
const { createStatusUpdate } = require("../utils");
require("dotenv").config();
const API_BASE_URL = process.env.API_BASE_URL;
module.exports = async (message) => {
  console.log(message, "Processing initializer queue");
  //validate message
  const { userId, subject, body, organizationId } = JSON.parse(message);
  if (!userId || !subject || !body || !organizationId) {
    console.log("Invalid message format");
    return;
  }
  try {
    //create petition
    const petitionResponse = await axios.post(
      `${API_BASE_URL}/petitions`,
      {
        fromUserId: userId,
        organizationId: organizationId,
        subject: subject,
        body: body,
        priority: "LOW",
        tag: "Unprocessed",
      },
      {
        timeout: 150000,
      }
    );
    console.log("✅ Petition Response", petitionResponse.data);

    //add submit status update
    const submitStatusUpdate = await createStatusUpdate(
      "SUBMITTED",
      "The petition has been submitted and is waiting to be processed.",
      petitionResponse.data.id
    );
    console.log("✅ Submit Status Update Response", submitStatusUpdate);

    //add to category queue
    const categoryQueueResponse = await addToQueue("CategoryQueue", {
      organizationId,
      text: subject + "\n" + body,
      petitionDetails: {
        id: petitionResponse.data.id,
      },
    });
    console.log("✅ Category Queue Response", categoryQueueResponse);

    //add queued status update
    const queuedStatusUpdate = await createStatusUpdate(
      "QUEUED",
      "The petition has been queued for processing.",
      petitionResponse.data.id
    );
    
    console.log("✅ Queued Status Update Response", queuedStatusUpdate);
  } catch (e) {
    console.log("❌ Error processing initializer queue");
    console.log(e);
  }
};
