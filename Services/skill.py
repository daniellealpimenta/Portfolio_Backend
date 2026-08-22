from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.skill import SkillRepository
from Schemas.skill import SkillCreate, SkillUpdate
from uuid import UUID

class SkillService:
    def __init__(self, db: Session):
        self.repository = SkillRepository(db)

    def create_skill(self, skill_data: SkillCreate, current_user_id: UUID):
        skill_data.user_id = current_user_id
        return self.repository.create(skill_data)

    def get_all_skills(self):
        return self.repository.get_all()

    def get_skill_by_id(self, skill_id: UUID):
        skill = self.repository.get_by_id(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill não encontrada")
        return skill

    def get_skills_by_user_id(self, user_id: UUID):
        return self.repository.get_by_user_id(user_id)

    def update_skill(self, skill_id: UUID, skill_data: SkillUpdate, current_user_id: UUID):
        skill = self.get_skill_by_id(skill_id)
        if skill.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar essa skill")

        updated = self.repository.update(skill_id, skill_data)
        return updated

    def delete_skill(self, skill_id: UUID, current_user_id: UUID):
        skill = self.get_skill_by_id(skill_id)
        if skill.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para excluir essa skill")

        self.repository.delete(skill_id)
        return {"detail": "Skill deletada com sucesso"}
