from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import uvicorn

# Load the model
MODEL_PATH = "./saved_model"
model = SentenceTransformer(MODEL_PATH)

app = FastAPI()

class TextInput(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Embedding server is running!"}

@app.post("/embed/")
def get_embedding(input_data: TextInput):
    """Generate embedding for the given text"""
    embedding = model.encode(input_data.text).tolist()
    return {"embedding": embedding}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
