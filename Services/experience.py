from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.experience import ExperienceRepository
from Repositories.user import UserRepository
from Schemas.experience import ExperienceCreate, ExperienceUpdate
from uuid import UUID

class ExperienceService:
    def __init__(self, db: Session):
        self.repository = ExperienceRepository(db)

    def create_experience(self, experience_data: ExperienceCreate):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(experience_data.user_id):
            raise HTTPException(status_code=400, detail="Usuário associado não existe")
        return self.repository.create(experience_data)

    def get_all_experiences(self):
        return self.repository.get_all()

    def get_experience_by_id(self, experience_id: UUID):
        experience = self.repository.get_by_id(experience_id)
        if not experience:
            raise HTTPException(status_code=404, detail="Experiência não encontrada")
        return experience

    def get_experiences_by_user_id(self, user_id: UUID):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(user_id):
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return self.repository.get_by_user_id(user_id)

    def update_experience(self, experience_id: UUID, experience_data: ExperienceUpdate):
        updated = self.repository.update(experience_id, experience_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Experiência não encontrada")
        return updated

    def delete_experience(self, experience_id: UUID):
        success = self.repository.delete(experience_id)
        if not success:
            raise HTTPException(status_code=404, detail="Experiência não encontrada")
        return {"detail": "Experiência deletada com sucesso"}
