from kafka_config import get_producer
import json

def send_to_repetitive_queue(data):
    producer = get_producer()
    topic = "RepetitiveQueue"

    # Convert data to JSON string if necessary
    message = json.dumps(data)

    def delivery_report(err, msg):
        if err:
            print(f" Message failed to send: {err}")
        else:
            print(f" Message delivered to {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")

    producer.produce(topic, value=message.encode("utf-8"), callback=delivery_report)
    producer.flush()  # Ensure the message is sent

# Example usage
if __name__ == "__main__":
    sample_data = {"user_id": 123, "category": "Technology"}
    send_to_category_queue(sample_data)
