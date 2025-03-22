const axios = require("axios");
require("dotenv").config();
const { createStatusUpdate } = require("../utils");

module.exports = async (message) => {
  try {
    const parsedMessage =
      typeof message === "string" ? JSON.parse(message) : message;
    const { text, organizationId, petitionDetails } = parsedMessage;
    if (!text || !organizationId || !petitionDetails) {
      console.error("❌ Missing required fields in message");
      return;
    }
    const payload = {
      text,
      organizationId,
      petitionDetails, // Sending entire petitionDetails
    };
    const availableServer = await getAvailableServer();
    availableServer.available = false; // Mark server as busy
    sendRequestToCategoryService(payload, availableServer);
  } catch (error) {
    console.error("❌ Error processing message:", error.message);
  }
};

const servers = [
  { url: process.env.CATEGORY_URL, available: false },
  { url: process.env.CATEGORY_URL_1, available: false },
  { url: process.env.CATEGORY_URL_2, available: false },
  { url: process.env.CATEGORY_URL_3, available: false },
  { url: process.env.CATEGORY_URL_4, available: false },
];

for (const server of servers) {
  checkServerAvailability(server);
}

async function getAvailableServer() {
  let availableServer = servers.find((server) => server.available);

  while (!availableServer) {
    console.log("⏳ No available servers for category queue, waiting...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 second
    availableServer = servers.find((server) => server.available);
  }

  return availableServer;
}

async function sendRequestToCategoryService(payload, availableServer) {
  try {
    console.log(`🚀 Sending request to ${availableServer.url}...`);
    const petitionId = payload.petitionDetails.id;
    createStatusUpdate(
      "CATEGORIZING",
      "Your petition is being processed and reviewed to determine the appropriate category before moving forward.",
      petitionId
    ).then(res => {
      console.log("✅ Categorizing status update response" , res)
    })
    const response = await axios.post(availableServer.url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    });
    console.log(`✅ Response from ${availableServer.url}:`, response.data);
    availableServer.available = true; // Mark server as available again
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error(
        `⏳ Timeout on ${availableServer.url}, marking as unavailable.`
      );
    } else {
      console.error(`❌ Error on ${availableServer.url}:`, error.message);
    }
    // Mark server as unavailable
    availableServer.available = false;
    checkServerAvailability(availableServer); // Start CPU usage check
  }
}

// Function to check CPU usage every 10 minutes
async function checkServerAvailability(server) {
  const cpuCheckUrl = server.url.replace("classify", "cpu-usage");
  while (!server.available) {
    console.log(`🔍 Checking CPU usage for ${server.url}...`);

    try {
      const response = await axios.get(cpuCheckUrl, {
        timeout: 20000, // Set timeout to 10 seconds
      });

      if (response.status === 200) {
        console.log(response.data);

        server.available = true; // Mark as available
        return;
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.log(`⏳ CPU check timed out, retrying in 2.5 minutes...`);
      } else {
        console.log(`❌ Error while checking CPU usage:`, error.message);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 150000)); // Wait 5 minutes
  }
}
