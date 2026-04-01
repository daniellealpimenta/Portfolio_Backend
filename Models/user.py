from fastapi import FastAPI
from pydantic import BaseModel, EmailStr

app = FastAPI()

class User(BaseModel):
    name: str
    age: int
    description: str
    main_phrase: str
    email: EmailStr
    phone_number: str
    url_linkedin: str
    personality_test_url: str
    curriculum_url: str
    url_github: str
    url_medium: str
    url_instagram: str
