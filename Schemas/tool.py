from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class ToolBase(BaseModel):
    name: str
    icon_url: Optional[str] = None

class ToolCreate(ToolBase):
    user_id: Optional[UUID] = None  # sobrescrito pelo backend com o dono da sessão

class ToolUpdate(BaseModel):
    name: Optional[str] = None
    icon_url: Optional[str] = None

class ToolResponse(ToolBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
