---
title: Embedding API
emoji: 🧠
colorFrom: blue
colorTo: gray
sdk: docker
sdk_version: "1.0"
app_file: main.py
pinned: false
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

# Embedding API

This is a FastAPI-based embedding server that uses the **multi-qa-mpnet-base-dot-v1** model from **SentenceTransformers** to generate text embeddings.

## Model Specification
- **Model Name:** multi-qa-mpnet-base-dot-v1
- **Architecture:** MPNet (Microsoft Pretrained Network)
- **Embedding Size:** 768
- **Use Case:** Optimized for multi-question answering (QA) and semantic search
- **Number of Layers:** 12
- **Number of Attention Heads:** 12
- **Hidden Size:** 768
- **Intermediate Size:** 3072
- **Vocabulary Size:** 30,527
- **Framework:** SentenceTransformers (Hugging Face)

## API Endpoints

### 1. Health Check
**Endpoint:** `GET /`

**Description:** Checks if the embedding server is running.

**Response:**
```json
{
  "message": "Embedding server is running!"
}
```

### 2. Generate Embedding
**Endpoint:** `POST /embed/`

**Description:** Generates an embedding for the provided input text.

**Request Body:**
```json
{
  "text": "Sample input text"
}
```

**Response:**
```json
{
  "embedding": [0.12345, -0.6789, ...] // 768-dimensional vector
}
```

## Running the API
To start the API server, run:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Installation
1. Install dependencies:
```bash
pip install fastapi uvicorn sentence-transformers
```
2. Make sure the model is available in `./saved_model/`.
3. Start the server as mentioned above.

## Usage
You can test the API using `curl`, Postman, or any HTTP client:
```bash
curl -X POST "http://localhost:8000/embed/" \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello world"}'
```

This will return the 768-dimensional embedding for the text input.

## Notes
- Ensure that `./saved_model` contains the pre-trained **multi-qa-mpnet-base-dot-v1** model.
- The API is optimized for embedding short text snippets for semantic search and retrieval tasks.

