from confluent_kafka import Producer
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

KAFKA_CONFIG = {
    "bootstrap.servers": os.getenv("KAFKA_BROKER"),  # e.g., "your-kafka-broker:9092"
    "security.protocol": "SASL_SSL",
    "sasl.mechanism": "SCRAM-SHA-256",
    "sasl.username": os.getenv("KAFKA_USERNAME"),
    "sasl.password": os.getenv("KAFKA_PASSWORD"),
}

def get_producer():
    return Producer(KAFKA_CONFIG)
