from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import date as Date, datetime
from uuid import UUID

class UserBase(BaseModel):
    name: str
    description: str
    birth_date: Date
    main_phrase: Optional[str] = None
    email: EmailStr
    cellphone_number: Optional[str] = None
    avatar_url: str
    linkedin_url: str
    github_url: Optional[str] = None
    medium_url: Optional[str] = None
    instagram_url: Optional[str] = None
    personality_test_url: Optional[str] = None
    curriculum_url: str

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    birth_date: Optional[Date] = None
    main_phrase: Optional[str] = None
    email: Optional[EmailStr] = None
    cellphone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    medium_url: Optional[str] = None
    instagram_url: Optional[str] = None
    personality_test_url: Optional[str] = None
    curriculum_url: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
