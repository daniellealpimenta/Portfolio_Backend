from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Core.deps import get_current_user
from Models.user import User
from Schemas.skill import SkillCreate, SkillResponse, SkillUpdate
from Services.skill import SkillService

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.post("/", response_model=SkillResponse, status_code=201)
def create_skill(skill_in: SkillCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.create_skill(skill_in, current_user.id)

@router.get("/", response_model=list[SkillResponse])
def get_all_skills(db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.get_all_skills()

@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill_by_id(skill_id: UUID, db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.get_skill_by_id(skill_id)

@router.get("/user/{user_id}", response_model=list[SkillResponse])
def get_skills_by_user_id(user_id: UUID, db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.get_skills_by_user_id(user_id)

@router.patch("/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: UUID, skill_in: SkillUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.update_skill(skill_id, skill_in, current_user.id)

@router.delete("/{skill_id}")
def delete_skill(skill_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = SkillService(db)
    return service.delete_skill(skill_id, current_user.id)
