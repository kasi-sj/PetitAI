import { producer } from "../config/kafkaConfig";
const sendMessage = async (message: any , topic : string) => {
  try {
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log(" Message sent:", message);
  } catch (error) {
    console.error(" Error sending message:", error);
  }
};
module.exports = sendMessage;
