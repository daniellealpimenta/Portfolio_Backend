from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Core.deps import get_current_user
from Models.user import User
from Schemas.recommendation import RecommendationCreate, RecommendationResponse, RecommendationUpdate
from Services.recommendation import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.post("/", response_model=RecommendationResponse, status_code=201)
def create_recommendation(recommendation_in: RecommendationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.create_recommendation(recommendation_in, current_user.id)

@router.get("/", response_model=list[RecommendationResponse])
def get_all_recommendations(db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.get_all_recommendations()

@router.get("/{recommendation_id}", response_model=RecommendationResponse)
def get_recommendation_by_id(recommendation_id: UUID, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.get_recommendation_by_id(recommendation_id)

@router.get("/user/{user_id}", response_model=list[RecommendationResponse])
def get_recommendations_by_user_id(user_id: UUID, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.get_recommendations_by_user_id(user_id)

@router.get("/experience/{experience_id}", response_model=list[RecommendationResponse])
def get_recommendations_by_experience_id(experience_id: UUID, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.get_recommendations_by_experience_id(experience_id)

@router.patch("/{recommendation_id}", response_model=RecommendationResponse)
def update_recommendation(recommendation_id: UUID, recommendation_in: RecommendationUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.update_recommendation(recommendation_id, recommendation_in, current_user.id)

@router.delete("/{recommendation_id}")
def delete_recommendation(recommendation_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = RecommendationService(db)
    return service.delete_recommendation(recommendation_id, current_user.id)
