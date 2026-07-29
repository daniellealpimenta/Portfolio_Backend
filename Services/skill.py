from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.skill import SkillRepository
from Repositories.user import UserRepository
from Schemas.skill import SkillCreate, SkillUpdate
from uuid import UUID

class SkillService:
    def __init__(self, db: Session):
        self.repository = SkillRepository(db)

    def create_skill(self, skill_data: SkillCreate):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(skill_data.user_id):
            raise HTTPException(status_code=400, detail="Usuário associado não existe")
        return self.repository.create(skill_data)

    def get_all_skills(self):
        return self.repository.get_all()

    def get_skill_by_id(self, skill_id: UUID):
        skill = self.repository.get_by_id(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill não encontrada")
        return skill

    def get_skills_by_user_id(self, user_id: UUID):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(user_id):
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return self.repository.get_by_user_id(user_id)

    def update_skill(self, skill_id: UUID, skill_data: SkillUpdate):
        updated = self.repository.update(skill_id, skill_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Skill não encontrada")
        return updated

    def delete_skill(self, skill_id: UUID):
        success = self.repository.delete(skill_id)
        if not success:
            raise HTTPException(status_code=404, detail="Skill não encontrada")
        return {"detail": "Skill deletada com sucesso"}
