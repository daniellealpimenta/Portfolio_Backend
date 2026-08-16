from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class ProjectLinkBase(BaseModel):
    name: str = Field(min_length=1, max_length=100, example="Repositório")
    url: str = Field(min_length=5, max_length=500, example="https://github.com/username/project")
    icon: str = Field(min_length=1, max_length=150, example="phosphor:GithubLogo")

class ProjectLinkCreate(ProjectLinkBase):
    project_id: UUID

class ProjectLinkUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    icon: Optional[str] = None

class ProjectLinkResponse(ProjectLinkBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
