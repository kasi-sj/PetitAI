# PetitAI - Intelligent Petition Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

An end-to-end platform for AI-powered petition processing and management, combining NLP, machine learning, and distributed systems.

## 📸 Application Preview
![Screenshot 2025-03-22 174105](https://github.com/user-attachments/assets/4e97b528-0a5a-486a-9ce9-cc8a422a6273)
![Screenshot 2025-03-22 174049](https://github.com/user-attachments/assets/5126975b-51e9-4da5-97d7-ba6302a73c4e)
![WhatsApp Image 2025-03-22 at 17 43 00_2ce7f47a](https://github.com/user-attachments/assets/258da946-aba3-4a40-97b3-eb8b23915f92)
![WhatsApp Image 2025-03-22 at 17 44 05_406e642e](https://github.com/user-attachments/assets/8596de05-1090-41aa-ae43-301907ebad78)
![WhatsApp Image 2025-03-22 at 17 44 32_7b8e9f60](https://github.com/user-attachments/assets/bb9a9069-8c66-4122-b13a-9dae6d928f74)
![WhatsApp Image 2025-03-22 at 17 44 49_9c43bb2c](https://github.com/user-attachments/assets/55bbe523-eaba-410d-8e01-f6bb0185fdba)
![WhatsApp Image 2025-03-22 at 17 45 51_e89aace6](https://github.com/user-attachments/assets/e70b6fc5-25ac-49b9-9899-622fcdc656c6)
![WhatsApp Image 2025-03-22 at 17 46 21_144aba91](https://github.com/user-attachments/assets/eec1e9a8-ec88-4f91-9d4f-84e0d3b00db5)
![WhatsApp Image 2025-03-22 at 17 46 50_0ce725e2](https://github.com/user-attachments/assets/270e1821-82c1-4dd3-b562-ca97ffb4fa25)
![WhatsApp Image 2025-03-22 at 17 48 01_9b05adc7](https://github.com/user-attachments/assets/bf0784b4-da7a-4397-bdab-7d7642d8e1bc)
![WhatsApp Image 2025-03-22 at 17 48 18_523844a7](https://github.com/user-attachments/assets/9b1716e9-d01a-4f64-a516-bc0cb9e0ce55)
![WhatsApp Image 2025-03-22 at 17 49 29_6511537c](https://github.com/user-attachments/assets/a73710dc-28ff-4358-81d4-dfa8614d3355)
![WhatsApp Image 2025-03-22 at 17 49 29_e2715f68](https://github.com/user-attachments/assets/f3313028-543e-438d-a338-642e40398e13)
![WhatsApp Image 2025-03-22 at 17 49 57_cc77cc38](https://github.com/user-attachments/assets/bffa058f-8c19-41a9-ba6f-9e6ef3cb3352)
![WhatsApp Image 2025-03-22 at 17 52 41_ec7bf5b5](https://github.com/user-attachments/assets/c4e33d0e-6bf4-46a8-b8a7-f49238441cfd)
![WhatsApp Image 2025-03-22 at 17 55 30_8b5af59d](https://github.com/user-attachments/assets/8da62e2f-835c-4b3d-a1d5-6796b802e619)
![WhatsApp Image 2025-03-22 at 17 55 57_2e0b98a4](https://github.com/user-attachments/assets/0bf2387d-5508-49b4-a536-0e768b1e0d75)
![WhatsApp Image 2025-03-22 at 17 56 44_39aac450](https://github.com/user-attachments/assets/bcded2df-a049-4208-b0b4-f74377030709)


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
