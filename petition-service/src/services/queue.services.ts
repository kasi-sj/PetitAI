import { producer } from "../config/kafkaConfig"
export const addMessageToQueue = async (topic: string, content: string) => {
    try {
        // Produce the message to the specified topic
        await producer.send({
            topic: topic,
            messages: [
                { value: content }
            ],
        });
        console.log(`Message sent to topic ${topic}: ${content}`);
    } catch (error) {
        console.error("Error sending message to Kafka:", error);
        throw error;
    }
};
