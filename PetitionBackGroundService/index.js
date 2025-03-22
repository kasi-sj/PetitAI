const kafka = require("./kafkaConfig");

// Import handlers
const processCategoryQueue = require("./handlers/categoryHandler");
const processRepetitiveQueue = require("./handlers/repetitiveHandler");
const processUserAssignerQueue = require("./handlers/userAssignerHandler");
const processNotificationQueue = require("./handlers/notificationHandler");
const processInitializerQueue = require("./handlers/initializerHandler");

const createConsumer = async (groupId, topic, handler) => {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topics: [topic] });

  console.log(`✅ Listening for messages on topic: ${topic}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`📩 Received message from ${topic}: ${value}`);
      
      try {
        await handler(value); // Process message with the appropriate handler
      } catch (error) {
        console.error(`❌ Error processing message from ${topic}:`, error);
      }
    },
  });

  return consumer;
};

// Create separate consumers
const run = async () => {
  console.log("Starting consumers...");
  await Promise.all([
    createConsumer("initializer-group", "InitializerQueue", processInitializerQueue),
    createConsumer("category-group", "CategoryQueue", processCategoryQueue),
    createConsumer("repetitive-group", "RepetitiveQueue", processRepetitiveQueue),
    createConsumer("user-assigner-group", "UserAssignerQueue", processUserAssignerQueue),
    createConsumer("notification-group", "NotificationQueue", processNotificationQueue),
  ]);
};

// Start consumers
run().catch(console.error);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down consumers...");
  process.exit();
});
