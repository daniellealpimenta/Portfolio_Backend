from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.experience import ExperienceRepository
from Schemas.experience import ExperienceCreate, ExperienceUpdate
from uuid import UUID

class ExperienceService:
    def __init__(self, db: Session):
        self.repository = ExperienceRepository(db)

    def create_experience(self, experience_data: ExperienceCreate, current_user_id: UUID):
        experience_data.user_id = current_user_id
        return self.repository.create(experience_data)

    def get_all_experiences(self):
        return self.repository.get_all()

    def get_experience_by_id(self, experience_id: UUID):
        experience = self.repository.get_by_id(experience_id)
        if not experience:
            raise HTTPException(status_code=404, detail="Experiência não encontrada")
        return experience

    def get_experiences_by_user_id(self, user_id: UUID):
        return self.repository.get_by_user_id(user_id)

    def update_experience(self, experience_id: UUID, experience_data: ExperienceUpdate, current_user_id: UUID):
        experience = self.get_experience_by_id(experience_id)
        if experience.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar essa experiência")

        updated = self.repository.update(experience_id, experience_data)
        return updated

    def delete_experience(self, experience_id: UUID, current_user_id: UUID):
        experience = self.get_experience_by_id(experience_id)
        if experience.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para excluir essa experiência")

        self.repository.delete(experience_id)
        return {"detail": "Experiência deletada com sucesso"}
