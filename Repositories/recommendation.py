from sqlalchemy.orm import Session
from Models.recommendation import Recommendation
from Schemas.recommendation import RecommendationCreate, RecommendationUpdate
from uuid import UUID

class RecommendationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, recommendation_data: RecommendationCreate) -> Recommendation:
        nova_recomendacao = Recommendation(**recommendation_data.model_dump())
        self.db.add(nova_recomendacao)
        self.db.commit()
        self.db.refresh(nova_recomendacao)
        return nova_recomendacao

    def get_all(self) -> list[Recommendation]:
        return self.db.query(Recommendation).all()

    def get_by_id(self, recommendation_id: UUID) -> Recommendation | None:
        return self.db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()

    def get_by_user_id(self, user_id: UUID) -> list[Recommendation]:
        return self.db.query(Recommendation).filter(Recommendation.user_id == user_id).all()

    def get_by_experience_id(self, experience_id: UUID) -> list[Recommendation]:
        return self.db.query(Recommendation).filter(Recommendation.experience_id == experience_id).all()

    def update(self, recommendation_id: UUID, recommendation_data: RecommendationUpdate) -> Recommendation | None:
        recomendacao = self.get_by_id(recommendation_id)
        if not recomendacao:
            return None

        for field, value in recommendation_data.model_dump(exclude_unset=True).items():
            setattr(recomendacao, field, value)

        self.db.commit()
        self.db.refresh(recomendacao)
        return recomendacao

    def delete(self, recommendation_id: UUID) -> bool:
        recomendacao = self.get_by_id(recommendation_id)
        if not recomendacao:
            return False

        self.db.delete(recomendacao)
        self.db.commit()
        return True
