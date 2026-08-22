from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class SkillBase(BaseModel):
    name: str
    description: str
    icon_url: Optional[str] = None

class SkillCreate(SkillBase):
    user_id: Optional[UUID] = None  # sobrescrito pelo backend com o dono da sessão

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon_url: Optional[str] = None

class SkillResponse(SkillBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
