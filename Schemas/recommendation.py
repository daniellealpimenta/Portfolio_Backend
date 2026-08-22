from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date as Date, datetime
from uuid import UUID

class RecommendationBase(BaseModel):
    name_recommender: str
    description: str
    linkedin_recommender_url: Optional[str] = None
    recommender_avatar_url: Optional[str] = None
    date: Optional[Date] = None

class RecommendationCreate(RecommendationBase):
    user_id: Optional[UUID] = None  # sobrescrito pelo backend com o dono da sessão
    experience_id: UUID

class RecommendationUpdate(BaseModel):
    name_recommender: Optional[str] = None
    description: Optional[str] = None
    linkedin_recommender_url: Optional[str] = None
    recommender_avatar_url: Optional[str] = None
    date: Optional[Date] = None

class RecommendationResponse(RecommendationBase):
    id: UUID
    user_id: UUID
    experience_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
