# 🧠 PetitAI – Intelligent Petition Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

PetitAI is a full-fledged, AI-powered platform designed to streamline petition creation, processing, and management using modern web technologies, distributed systems, and machine learning. It brings together a user-friendly interface with robust backend services to automate the petition workflow from submission to resolution.

## 📸 Application Preview

![image](https://github.com/user-attachments/assets/7f60102c-12dd-4f24-9a02-1f8af915fdc9)


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
