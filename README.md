# 🧠 PetitAI – Intelligent Petition Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

PetitAI is a full-fledged, AI-powered platform designed to streamline petition creation, processing, and management using modern web technologies, distributed systems, and machine learning. It brings together a user-friendly interface with robust backend services to automate the petition workflow from submission to resolution.

## 📸 Application Preview

![image](https://github.com/user-attachments/assets/7f60102c-12dd-4f24-9a02-1f8af915fdc9)

# Admin
![image](https://github.com/user-attachments/assets/88e44084-583e-46c4-8175-27d8c2c7897a)
![image](https://github.com/user-attachments/assets/7f6dd854-ba12-46a8-9b87-04f179bed3ac)
![image](https://github.com/user-attachments/assets/999e3bb6-5d40-4607-9ea7-99df5fee811d)
![image](https://github.com/user-attachments/assets/49794a28-2174-43bb-8741-ba24b11398c9)
![image](https://github.com/user-attachments/assets/848ac751-11d7-42a2-9efd-6665ed15f0fd)
![image](https://github.com/user-attachments/assets/f7f367a7-9abc-4329-a4f9-615d01892fd6)
![image](https://github.com/user-attachments/assets/46c21660-eb49-4c15-bcac-af0060c712db)
![image](https://github.com/user-attachments/assets/f9f1ec16-9a5e-4505-a387-b71cb41c8595)

# Petition Handler (Organization User)
![image](https://github.com/user-attachments/assets/98cef845-1c60-4b2c-a34f-ab4527662843)
![image](https://github.com/user-attachments/assets/f8accbd9-ae11-44a5-b48c-b53e15b236dc)
![image](https://github.com/user-attachments/assets/a9d246d2-ea6e-4b12-9080-56c4345185ff)
![image](https://github.com/user-attachments/assets/0ab8a65d-6f16-4082-acc6-c83b42f55355)
![image](https://github.com/user-attachments/assets/b87c99b5-2dba-4b01-830b-da539c81a4c0)
![image](https://github.com/user-attachments/assets/bf1cafe4-4629-41c5-90f5-4cbe172639cc)
![image](https://github.com/user-attachments/assets/eec9657e-f2c3-4596-b13d-baa61b38ec23)
![image](https://github.com/user-attachments/assets/01703e86-e453-47eb-8097-ec5f0f70ce87)

# Petition Submitter (User)
![image](https://github.com/user-attachments/assets/5f177112-9985-434e-a2b0-af5be25a5c68)
![image](https://github.com/user-attachments/assets/015abfc5-d094-4252-a8d8-079070902193)
![image](https://github.com/user-attachments/assets/b6cb1efa-3b34-4259-97da-0f6027f3ef13)

### 🛎️ Notification Templates

<div align="center">
  <img src="https://github.com/user-attachments/assets/4e97b528-0a5a-486a-9ce9-cc8a422a6273" alt="Template View 1" width="45%" />
  <img src="https://github.com/user-attachments/assets/5126975b-51e9-4da5-97d7-ba6302a73c4e" alt="Template View 2" width="45%" />
</div>


## 🗂 Project Components

### 1. Text Embedding Service
- **Purpose**: Generates semantic embeddings for similarity analysis
- **Features**:
  - Converts petition text to vector representations
  - Enables semantic search capabilities
  - Powers duplicate petition detection
- **Technology**: Sentence Transformers, FAISS
- [Repository Link](text-embedding/)

### 2. AI Categorization Engine
- **Purpose**: Automatically classifies petitions into departments/categories
- **Features**:
  - Uses fine-tuned NLP models
  - Supports multi-label classification
  - Continuous model training pipeline
- **Technology**: PyTorch, Hugging Face Transformers
- [Repository Link](Categorization/)

### 3. Authentication Service (PetitAI-Auth)
- **Purpose**: Manages user authentication and authorization
- **Features**:
  - JWT-based authentication
  - Role-based access control
  - OAuth2 social login integration
- **Technology**: Node.js, Express, Passport.js
- [Repository Link](PetitAI-Auth/)

### 4. Petition Processing Pipeline (PetitionBackGroundService)
- **Purpose**: Orchestrates petition workflow stages
- **Features**:
  - Kafka-based message queue system
  - Handles categorization, duplication checks, and notifications
  - Background task scheduling
- **Technology**: Apache Kafka, Python, APScheduler
- [Repository Link](PetitionBackGroundService/)

### 5. Core Backend Service (petition-service)
- **Purpose**: Main API for petition management
- **Features**:
  - RESTful API endpoints
  - Database management
  - Integration with AI services
- **Technology**: Flask, SQLAlchemy, PostgreSQL
- [Repository Link](petition-service/)

### 6. Frontend Application (petitionai)
- **Purpose**: User-facing web interface
- **Features**:
  - Petition creation and tracking
  - Real-time status updates
  - Admin dashboard
- **Technology**: React, Redux, Material-UI
- [Repository Link](petitionai/)

## 🔄 System Workflow

1. **User Submission**  
   Frontend (petitionai) → Backend (petition-service)

2. **Authentication**  
   PetitAI-Auth verifies user credentials

3. **Initial Processing**  
   petition-service → PetitionBackGroundService

4. **AI Analysis**:
   - Text Embedding → Generates semantic vectors
   - Categorization → Determines department
   - Duplicate Check → Compares with existing petitions

5. **Notification**  
   Background service triggers user updates

## 🌐 Architecture Overview
```
Frontend (React)
│
├─ Backend API (Flask)
│ ├─ Auth Service
│ ├─ Database
│ └─ Message Queue
│
├─ AI Services
│ ├─ Text Embedding
│ └─ Categorization
│
└─ Processing Pipeline
├─ Kafka Workers
├─ Duplication Check
└─ Notification System
```

## 📚 Documentation Links

| Component | Description | Documentation |
|-----------|-------------|---------------|
| `text-embedding` | Semantic analysis server | [README](text-embedding/README.md) |
| `Categorization` | ML classification engine | [README](Categorization/README.md) |
| `PetitAI-Auth` | Authentication service | [README](PetitAI-Auth/README.md) |
| `PetitionBackGroundService` | Workflow orchestration | [README](PetitionBackGroundService/README.md) |
| `petition-service` | Core API backend | [README](petition-service/README.md) |
| `petitionai` | User interface | [README](petitionai/README.md) |

## 🚀 Getting Started

1. Clone main repository:  
   `git clone https://github.com/kasi-sj/PetitAI.git`

2. Follow individual component READMEs for setup instructions

3. Start core services in this order:  
   1. Database (PostgreSQL)  
   2. Authentication Service  
   3. Text Embedding Server  
   4. Backend API  
   5. Processing Pipeline  
   6. Frontend

## 📄 License

MIT License - See [LICENSE](LICENSE) for details
