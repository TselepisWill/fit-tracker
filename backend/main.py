from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId
import motor.motor_asyncio

app = FastAPI()

# CORS for React Native or web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup (adjust URI as needed)
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.fitness
meal_collection = db.meals

# Example user model
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    age: Optional[int] = None

@app.get("/")
def read_root():
    return {"API": "Running"}

@app.post("/api/users")
def create_user(user_data: UserCreate):
    return {"user": user_data.dict(exclude={"password"})}

# Delete meal by ID
@app.delete("/api/meals/{meal_id}")
async def delete_meal(meal_id: str):
    if not ObjectId.is_valid(meal_id):
        raise HTTPException(status_code=400, detail="Invalid meal ID")

    result = await meal_collection.delete_one({"_id": ObjectId(meal_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Meal not found")

    return {"success": True, "message": "Meal deleted successfully"}
