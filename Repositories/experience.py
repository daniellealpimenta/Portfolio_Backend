from sqlalchemy.orm import Session
from Models.experience import Experience
from Schemas.experience import ExperienceCreate, ExperienceUpdate
from uuid import UUID

class ExperienceRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, experience_data: ExperienceCreate) -> Experience:
        nova_experiencia = Experience(**experience_data.model_dump())
        self.db.add(nova_experiencia)
        self.db.commit()
        self.db.refresh(nova_experiencia)
        return nova_experiencia

    def get_all(self) -> list[Experience]:
        return self.db.query(Experience).all()

    def get_by_id(self, experience_id: UUID) -> Experience | None:
        return self.db.query(Experience).filter(Experience.id == experience_id).first()

    def get_by_user_id(self, user_id: UUID) -> list[Experience]:
        return self.db.query(Experience).filter(Experience.user_id == user_id).all()

    def update(self, experience_id: UUID, experience_data: ExperienceUpdate) -> Experience | None:
        experiencia = self.get_by_id(experience_id)
        if not experiencia:
            return None

        for field, value in experience_data.model_dump(exclude_unset=True).items():
            setattr(experiencia, field, value)

        self.db.commit()
        self.db.refresh(experiencia)
        return experiencia

    def delete(self, experience_id: UUID) -> bool:
        experiencia = self.get_by_id(experience_id)
        if not experiencia:
            return False

        self.db.delete(experiencia)
        self.db.commit()
        return True
