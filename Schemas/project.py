from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import date as Date, datetime
from uuid import UUID
from enum import Enum

class Category(str, Enum):
    FrontEnd = "FrontEnd"
    BackEnd = "BackEnd"
    FullStack = "FullStack"
    DataScience = "DataScience"
    GameDev = "GameDev"
    Mobile = "Mobile"
    Other = "Other"


class ProjectBase(BaseModel):
    name: str = Field(min_length=5, max_length=255, example="Todo List App")
    github_url: Optional[str] = Field(min_length=5, max_length=255, example="https://github.com/username/todo-list-app", default=None)
    test_url: Optional[str] = Field(min_length=5, max_length=255, example="https://vercel.com/username/todo-list-app", default=None)
    category: Category = Field(example="FullStack")
    date: Date = Field(example="2023-08-15")

class ProjectCreate(ProjectBase):
    user_id: UUID  

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    github_url: Optional[str] = None
    test_url: Optional[str] = None
    category: Optional[Category] = None
    date: Optional[Date] = None

class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    likes: int
    
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)