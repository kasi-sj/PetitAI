import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER || ""],
  ssl: {},
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME || "",
    password: process.env.KAFKA_PASSWORD || "",
  },
});

export const producer = kafka.producer();

export const connectToQueue = async () => {
  try {
    await producer.connect();
    console.log("Connected to Kafka producer");
  } catch (error) {
    console.error("Error connecting to Kafka producer:", error);
  }
};