# Petition Processing Kafka Consumer Service

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Kafka Compatible](https://img.shields.io/badge/Apache_Kafka-3.0+-blue)](https://kafka.apache.org/)

A distributed consumer service for processing petitions through multiple stages using Apache Kafka. Part of the PetitAI ecosystem for intelligent petition management.

## 📌 Features

- Multi-topic consumption with consumer groups
- Independent processing pipelines for different petition stages
- Graceful shutdown handling
- Customizable message handlers
- Error logging and monitoring
- Horizontal scalability through consumer groups

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Apache Kafka 3.0+ cluster
- Kafka topics pre-created:
    - InitializerQueue
    - CategoryQueue
    - RepetitiveQueue
    - UserAssignerQueue
    - NotificationQueue

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/petition-processing-service.git

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### ⚙️ Configuration
Update the `.env` file:
```
KAFKA_BROKERS=localhost:9092
GROUP_ID_PREFIX=petition-processor
LOG_LEVEL=info

# Configure handlers as needed
INITIALIZER_CONCURRENCY=2
NOTIFICATION_RETRIES=3
```

### 📂 Project Structure
```
├── config/
│   └── kafkaConfig.js
├── handlers/
│   ├── categoryHandler.js
│   ├── repetitiveHandler.js
│   ├── userAssignerHandler.js
│   ├── notificationHandler.js
│   └── initializerHandler.js
├── index.js
├── package.json
└── README.md
```

### 🚦 Processing Flow
1. **Initialization**: New petitions enter through `InitializerQueue`.
2. **Categorization**: `CategoryHandler` classifies petition type.
3. **Duplicate Check**: `RepetitiveHandler` identifies duplicates.
4. **Assignment**: `UserAssignerHandler` routes to responsible parties.
5. **Notification**: `NotificationHandler` sends user alerts.

### 🏃 Running the Service
```bash
# Start the consumer service
node index.js
```

### 🔧 Environment Variables
### 🔧 Environment Variables

| Variable         | Default              | Description                        |
|------------------|----------------------|------------------------------------|
| `KAFKA_BROKERS`  | `localhost:9092`     | Kafka broker addresses             |
| `GROUP_ID_PREFIX`| `petition-processor` | Consumer group prefix              |
| `LOG_LEVEL`      | `info`               | Logging verbosity                  |
| `HANDLER_TIMEOUT`| `30000`              | Max processing time per message (ms)|

📧 Contact
Maintainer: kasi-sj
Email: kasinathansj@gmail.com
Project Link: https://github.com/kasi-sj/PetitAI/blob/main/PetitionBackGroundService