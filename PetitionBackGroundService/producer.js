const axios = require("axios");
require("dotenv").config();
const API_BASE_URL = process.env.API_BASE_URL;

exports.addToQueue = async (queue, content) => {
  const queueResponse = await axios.post(`${API_BASE_URL}/queues/add`, {
    topic: queue,
    content: JSON.stringify(content),
  });
  return queueResponse.data;
};
