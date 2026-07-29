from sqlalchemy.orm import Session
from Models.skill import Skill
from Schemas.skill import SkillCreate, SkillUpdate
from uuid import UUID

class SkillRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, skill_data: SkillCreate) -> Skill:
        nova_skill = Skill(**skill_data.model_dump())
        self.db.add(nova_skill)
        self.db.commit()
        self.db.refresh(nova_skill)
        return nova_skill

    def get_all(self) -> list[Skill]:
        return self.db.query(Skill).all()

    def get_by_id(self, skill_id: UUID) -> Skill | None:
        return self.db.query(Skill).filter(Skill.id == skill_id).first()

    def get_by_user_id(self, user_id: UUID) -> list[Skill]:
        return self.db.query(Skill).filter(Skill.user_id == user_id).all()

    def update(self, skill_id: UUID, skill_data: SkillUpdate) -> Skill | None:
        skill = self.get_by_id(skill_id)
        if not skill:
            return None

        for field, value in skill_data.model_dump(exclude_unset=True).items():
            setattr(skill, field, value)

        self.db.commit()
        self.db.refresh(skill)
        return skill

    def delete(self, skill_id: UUID) -> bool:
        skill = self.get_by_id(skill_id)
        if not skill:
            return False

        self.db.delete(skill)
        self.db.commit()
        return True
