from sqlalchemy.orm import Session
from Models.project_link import ProjectLink
from Schemas.project_link import ProjectLinkCreate, ProjectLinkUpdate
from uuid import UUID

class ProjectLinkRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, link_data: ProjectLinkCreate) -> ProjectLink:
        novo_link = ProjectLink(**link_data.model_dump())
        self.db.add(novo_link)
        self.db.commit()
        self.db.refresh(novo_link)
        return novo_link

    def get_all(self) -> list[ProjectLink]:
        return self.db.query(ProjectLink).all()

    def get_by_id(self, link_id: UUID) -> ProjectLink | None:
        return self.db.query(ProjectLink).filter(ProjectLink.id == link_id).first()

    def get_by_project_id(self, project_id: UUID) -> list[ProjectLink]:
        return self.db.query(ProjectLink).filter(ProjectLink.project_id == project_id).all()

    def update(self, link_id: UUID, link_data: ProjectLinkUpdate) -> ProjectLink | None:
        link = self.get_by_id(link_id)
        if not link:
            return None

        for field, value in link_data.model_dump(exclude_unset=True).items():
            setattr(link, field, value)

        self.db.commit()
        self.db.refresh(link)
        return link

    def delete(self, link_id: UUID) -> bool:
        link = self.get_by_id(link_id)
        if not link:
            return False

        self.db.delete(link)
        self.db.commit()
        return True
