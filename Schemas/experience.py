from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date as Date, datetime
from uuid import UUID

class ExperienceBase(BaseModel):
    position: str
    company: str
    description: str
    start_date: Date
    exit_date: Optional[Date] = None
    image_url: Optional[str] = None

class ExperienceCreate(ExperienceBase):
    user_id: UUID

class ExperienceUpdate(BaseModel):
    position: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[Date] = None
    exit_date: Optional[Date] = None
    image_url: Optional[str] = None

class ExperienceResponse(ExperienceBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
