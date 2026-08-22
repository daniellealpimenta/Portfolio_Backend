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
    categories: List[Category] = Field(min_length=1, example=["FullStack", "Mobile"])
    date: Date = Field(example="2023-08-15")
    description: Optional[str] = Field(None, example="Projeto de automação financeira...")

class ProjectCreate(ProjectBase):
    # Ignorado/sobrescrito pelo backend com o dono real da sessão autenticada —
    # opcional aqui só pra não travar a requisição se o cliente não mandar.
    user_id: Optional[UUID] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    categories: Optional[List[Category]] = Field(default=None, min_length=1)
    date: Optional[Date] = None
    description: Optional[str] = None
    likes: Optional[int] = None

class LikeIn(BaseModel):
    # Identificador anônimo persistido num cookie no navegador (não é UUID de usuário logado)
    visitor_id: str = Field(min_length=8, max_length=100)

class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    likes: int
    
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)