from sqlalchemy.orm import mapped_column, Mapped, relationship
from Models.base import BaseORMModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from Models.project import Project

class Tool(BaseORMModel):
    __tablename__ = "tool"

    name: Mapped[str] = mapped_column(nullable=False)
    icon_url: Mapped[str] = mapped_column(nullable=True)

    # Relationship
    projects: Mapped[list["Project"]] = relationship(secondary="project_tool", back_populates="tools")