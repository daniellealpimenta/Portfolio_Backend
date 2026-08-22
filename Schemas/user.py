from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import date as Date, datetime
from uuid import UUID

class UserBase(BaseModel):
    name: str
    username: Optional[str] = None
    description: Optional[str] = None
    birth_date: Optional[Date] = None
    main_phrase: Optional[str] = None
    email: EmailStr
    cellphone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    medium_url: Optional[str] = None
    instagram_url: Optional[str] = None
    personality_test_url: Optional[str] = None
    curriculum_url: Optional[str] = None
    curriculum_en_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
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
    curriculum_en_url: Optional[str] = None

class UserResponse(UserBase):
    id: UUID

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserPublicResponse(BaseModel):
    """Versão exposta publicamente (páginas do portfólio) — sem e-mail.
    cellphone_number fica incluído de propósito: é usado no botão de
    contato via WhatsApp no site público."""
    id: UUID
    name: str
    username: Optional[str] = None
    description: Optional[str] = None
    main_phrase: Optional[str] = None
    cellphone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    medium_url: Optional[str] = None
    instagram_url: Optional[str] = None
    personality_test_url: Optional[str] = None
    curriculum_url: Optional[str] = None
    curriculum_en_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
