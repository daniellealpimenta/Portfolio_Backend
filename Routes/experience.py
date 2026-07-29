from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Schemas.experience import ExperienceCreate, ExperienceResponse, ExperienceUpdate
from Services.experience import ExperienceService

router = APIRouter(prefix="/experiences", tags=["Experiences"])

@router.post("/", response_model=ExperienceResponse, status_code=201)
def create_experience(experience_in: ExperienceCreate, db: Session = Depends(get_db)):
    service = ExperienceService(db)
    return service.create_experience(experience_in)

@router.get("/", response_model=list[ExperienceResponse])
def get_all_experiences(db: Session = Depends(get_db)):
    service = ExperienceService(db)
    return service.get_all_experiences()

@router.get("/{experience_id}", response_model=ExperienceResponse)
def get_experience_by_id(experience_id: UUID, db: Session = Depends(get_db)):
    service = ExperienceService(db)
    return service.get_experience_by_id(experience_id)

@router.get("/user/{user_id}", response_model=list[ExperienceResponse])
def get_experiences_by_user_id(user_id: UUID, db: Session = Depends(get_db)):
    service = ExperienceService(db)
    return service.get_experiences_by_user_id(user_id)

@router.patch("/{experience_id}", response_model=ExperienceResponse)
def update_experience(experience_id: UUID, experience_in: ExperienceUpdate, db: Session = Depends(get_db)):
    service = ExperienceService(db)
    return service.update_experience(experience_id, experience_in)

@router.delete("/{experience_id}")
def delete_experience(experience_id: UUID, db: Session = Depends(get_db)):
    service = ExperienceService(db)
    return service.delete_experience(experience_id)
