from sqlite3 import Date

from fastapi import FastAPI
from pydantic import BaseModel
from enum import Enum
from Models.user import User

app = FastAPI()

class Categories(str, Enum):
    FrontEnd = "FrontEnd"
    BackEnd = "BackEnd"
    FullStack = "FullStack"
    DataScience = "DataScience"
    GameDev = "GameDev"
    Mobile = "Mobile"
    Other = "Other"

class Project(BaseModel):
    user_id: User
    name: str
    icon: str
    url_github: str
    url_usage: str
    category: Categories
    date: Date
    likes: int