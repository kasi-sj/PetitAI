---
title: Categorization
emoji: 🐨
colorFrom: gray
colorTo: pink
sdk: docker
pinned: false
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference


# Text Classification API

This is a FastAPI-based service that classifies text into predefined departments using the Mistral-7B-Instruct model.

## Features
- Classifies input text into the most relevant department.
- Uses the Mistral-7B-Instruct model for classification.
- Returns structured JSON responses.
- Provides an API endpoint for classification.
- Logs execution time for performance analysis.

## Space Configuration
This project is hosted on **Hugging Face Spaces** using Docker.

## Setup & Installation
1. Ensure the required dependencies are installed by specifying them in `requirements.txt`:

   ```bash
   fastapi
   uvicorn
   pydantic
   llama-cpp-python
   huggingface-hub
   ...
   ```

2. Place the model file `mistral-7b-instruct-v0.1.Q2_K.gguf` in the project directory.

3. Run the application using the following command:

   ```bash
   uvicorn app:app --host 0.0.0.0 --port 7860
   ```

## API Endpoints

## Base Url
https://kasinathansj-categorization.hf.space

### Home
**GET `/`**

#### Response Body:
```json
{
    "message": "Text classification API is running!"
}
```

### Classify Text
**POST `/classify`**

#### Request Body:
```json
{
    "text": "The IT department needs new software updates.",
    "departments": [
        {"name": "IT", "description": "Handles software and hardware issues."},
        {"name": "HR", "description": "Manages employee relations."}
    ]
}
```

#### Response Body:
```json
{
    "text": "The IT department needs new software updates.",
    "department": "IT",
    "reason": "The text pertains to software and hardware issues.",
    "time_taken": 1.23
}
```

## Logs
Application logs are visible in the Hugging Face Space runtime output.

## License
MIT License

## Author
[Kasinathan SJ](https://huggingface.co/kasinathansj)

