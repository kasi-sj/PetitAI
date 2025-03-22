import logging
import time
import json
import re
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from llama_cpp import Llama
from severity_check import get_highest_severity_word, SEVERITY_ORDER
from producer import send_to_repetitive_queue
import httpx
import os
import psutil
from typing import Dict, Any
from huggingface_hub import hf_hub_download


# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),  # Logs to console
        logging.FileHandler("server.log", mode="a")  # Logs to file
    ]
)
logging.getLogger("httpx").setLevel(logging.WARNING)

app = FastAPI()

# Modify input model to include organizationId instead of organizationName
class TextInput(BaseModel):
    text: str
    organizationId: str
    petitionDetails: Dict[str, Any]  # Dictionary to store petition details

# Fetch departments based on organizationId using the provided URL format.
async def fetch_departments(org_id: str):
    # Example: http://localhost:4000/organizations/{org_id}/departments
    const_base_url = os.getenv("PETITION_SERVICE_BACKEND_URL", "http://localhost:4000")
    url = f"{const_base_url}/organizations/{org_id}/departments"
    print(url)
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()["departments"]
            return [
                {
                    "department": dept["name"],
                    "description": dept["description"],
                    "id": dept["id"]
                }
                for dept in data
            ]
    except Exception as e:
        logging.error(f"Failed to fetch departments: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch departments")

@app.get("/cpu-usage")
def get_cpu_usage():
    """Returns the current CPU usage percentage."""
    try:
        cpu_usage = psutil.cpu_percent(interval=1)  # 1-second interval
        return {"cpu_usage": cpu_usage}
    except Exception as e:
        logging.error(f"Failed to retrieve CPU usage: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve CPU usage")

@app.get("/")
def home():
    logging.info("Home endpoint accessed")
    return {"message": "Categorization server is running!"}


# Define model details
# REPO_ID = "TheBloke/Mistral-7B-Instruct-v0.2-GGUF"
# FILENAME = "mistral-7b-instruct-v0.2.Q4_0.gguf"

REPO_ID = "TheBloke/Mistral-7B-Instruct-v0.1-GGUF"
FILENAME = "mistral-7b-instruct-v0.1.Q4_K_M.gguf" 

def load_model():
    try:
        logging.info("Downloading & Loading model...")

        # Automatically download from Hugging Face Hub
        model_path = hf_hub_download(repo_id=REPO_ID, filename=FILENAME)

        # Load model
        model = Llama(
            model_path=model_path,
            n_ctx=8192,  # Increase if the model supports it
            n_threads=4,  # Adjust for CPU
            n_batch=512,  # Tune for performance
        )

        logging.info("✅ Model loaded successfully!")
        return model

    except Exception as e:
        logging.error(f"❌ Error loading model: {e}")
        raise RuntimeError("Failed to load model")

llm = load_model()

# Generate classification prompt
def generate_prompt(text, departments):
    converted_department = [
        {
            "department": dept["department"],
            "description": dept["description"],
        }
        for dept in departments
    ]
    department_definitions = json.dumps(converted_department, indent=4)
    
    return f"""
    You are an AI that strictly returns a JSON object categorizing text into the most relevant department.

    **Departments and Definitions:**
    {department_definitions}

    **Follow these rules:**
    - Always return a **single** department that best fits.
    - Assess the **severity** as one of the following: "High", "Medium", or "Low".
    - Do not add extra text before or after the JSON.
    - Stick to the format exactly as shown.

    **Example Output:**
    
    {{
        "department": "Example Department",
        "reason": "The text pertains to example-related matters.",
        "severity": "High"
    }}

    **Classify the following text with reason and determine its severity:**

    "{text}"
    """.strip()

# Extract JSON response from model output
def extract_json(response_text):
    json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
    if json_match:
        response_text = json_match.group(0)
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        logging.error(f"Failed to parse JSON: {response_text}")
        return {"department": "Unknown", "reason": "Response not in expected format.", "severity": "Unknown"}

# Function to classify a single text
def classify_petition(text, departments):
    logging.info(f"Classifying text: {text}")

    local_severity = get_highest_severity_word(text)
    prompt = generate_prompt(text, departments)

    try:
        start_time = time.time()
        output = llm(prompt, max_tokens=256, temperature=0.2)
        execution_time = round(time.time() - start_time, 2)

        response_text = output["choices"][0]["text"].strip()
        response_json = extract_json(response_text)

        department = response_json.get("department", "Unknown")
        reason = response_json.get("reason", "No reason provided.")
        llm_severity = response_json.get("severity", "Unknown")
        logging.info(f"Classification result: {department} (Time: {execution_time}s)")
        if local_severity is None:
            final_severity = llm_severity  # Default to LLM severity if no local severity is found
        elif llm_severity is None:
            final_severity = local_severity  # Default to local severity if LLM is missing
        else:
            # Both severities exist, compare them
            final_severity = local_severity if SEVERITY_ORDER.get(local_severity, 0) >= SEVERITY_ORDER.get(llm_severity, 0) else llm_severity
        return {
            "text": text,
            "department": department,
            "severity": final_severity,
            "reason": reason,
            "time_taken": execution_time
        }
    except Exception as e:
        logging.error(f"Error during classification: {e}")
        return {"error": "Internal classification error"}

@app.post("/classify")
async def classify(text_input: TextInput):
    logging.info(f"Received classification request: {text_input.text}")

    try:
        # Now fetch departments using organizationId
        departments = await fetch_departments(text_input.organizationId)
        result = classify_petition(text_input.text, departments)
        if result["department"]:
            matching_department = next(
                (dept for dept in departments if dept["department"] == result["department"]), 
                None
            )
            if matching_department:
                result["departmentId"] = matching_department["id"]
        result["organizationId"] = text_input.organizationId
        result["petitionDetails"] = text_input.petitionDetails
        logging.info(f"Response: {result}")
        send_to_repetitive_queue(result)  # Send to Kafka queue
        
        return result
    except Exception as e:
        logging.error(f"Classification request failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    logging.info("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
