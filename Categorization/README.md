# Text Classification API

This is a FastAPI-based service that classifies text into predefined departments using the Mistral-7B-Instruct model.

## Features
- Classifies input text into the most relevant department.
- Uses the Mistral-7B-Instruct model for classification.
- Returns structured JSON responses.
- Provides an API endpoint for classification.
- Logs execution time for performance analysis.

## 🧰 Tech Stack
- Framework: FastAPI
- Model Inference: llama-cpp-python
- Model: Mistral-7B-Instruct (Q4_K_M GGUF)
- Deployment: Hugging Face Spaces (Docker-based)
- Runtime: Python 3.10+

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

### ⚡ Quick Start
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/text-classification-api.git
    cd text-classification-api
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Download and place the model:
    - Download from: TheBloke/Mistral-7B-Instruct-v0.1-GGUF
    - Place mistral-7b-instruct-v0.1.Q4_K_M.gguf in the project root.

4. Run the FastAPI app:
    ```bash
    uvicorn app:app --host 0.0.0.0 --port 7860
    ```

## License
MIT License

## Author
[Kasinathan SJ](https://huggingface.co/kasinathansj)

