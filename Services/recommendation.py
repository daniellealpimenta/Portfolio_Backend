from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.recommendation import RecommendationRepository
from Repositories.experience import ExperienceRepository
from Schemas.recommendation import RecommendationCreate, RecommendationUpdate
from uuid import UUID

class RecommendationService:
    def __init__(self, db: Session):
        self.repository = RecommendationRepository(db)

    def create_recommendation(self, recommendation_data: RecommendationCreate, current_user_id: UUID):
        recommendation_data.user_id = current_user_id

        exp_repo = ExperienceRepository(self.repository.db)
        experience = exp_repo.get_by_id(recommendation_data.experience_id)
        if not experience:
            raise HTTPException(status_code=400, detail="Experiência associada não existe")
        if experience.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Essa experiência não pertence a você")

        return self.repository.create(recommendation_data)

    def get_all_recommendations(self):
        return self.repository.get_all()

    def get_recommendation_by_id(self, recommendation_id: UUID):
        rec = self.repository.get_by_id(recommendation_id)
        if not rec:
            raise HTTPException(status_code=404, detail="Recomendação não encontrada")
        return rec

    def get_recommendations_by_user_id(self, user_id: UUID):
        return self.repository.get_by_user_id(user_id)

    def get_recommendations_by_experience_id(self, experience_id: UUID):
        return self.repository.get_by_experience_id(experience_id)

    def update_recommendation(self, recommendation_id: UUID, recommendation_data: RecommendationUpdate, current_user_id: UUID):
        rec = self.get_recommendation_by_id(recommendation_id)
        if rec.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar essa recomendação")

        updated = self.repository.update(recommendation_id, recommendation_data)
        return updated

    def delete_recommendation(self, recommendation_id: UUID, current_user_id: UUID):
        rec = self.get_recommendation_by_id(recommendation_id)
        if rec.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para excluir essa recomendação")

        self.repository.delete(recommendation_id)
        return {"detail": "Recomendação deletada com sucesso"}
