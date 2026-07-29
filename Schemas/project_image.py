from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class ProjectImageBase(BaseModel):
    image_path: str
    description: Optional[str] = None

class ProjectImageCreate(ProjectImageBase):
    project_id: UUID

class ProjectImageUpdate(BaseModel):
    image_path: Optional[str] = None
    description: Optional[str] = None

class ProjectImageResponse(ProjectImageBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
