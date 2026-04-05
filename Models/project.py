from enum import Enum
from typing import TYPE_CHECKING
from Models.base import BaseORMModel

from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import ForeignKey
from datetime import date as Date
import uuid

if TYPE_CHECKING:
    from Models.user import User
    from Models.tool import Tool
    from Models.project_image import ProjectImage

class Category(str, Enum):
    FrontEnd = "FrontEnd"
    BackEnd = "BackEnd"
    FullStack = "FullStack"
    DataScience = "DataScience"
    GameDev = "GameDev"
    Mobile = "Mobile"
    Other = "Other"

class Project(BaseORMModel):
    __tablename__ = "project"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("user.id"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    github_url: Mapped[str] = mapped_column(nullable=True)
    test_url: Mapped[str] = mapped_column(nullable=True)
    category: Mapped[Category] = mapped_column(nullable=False)
    likes: Mapped[int] = mapped_column(default=0, nullable=False)
    date: Mapped[Date] = mapped_column(nullable=False)

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="projects")
    tools: Mapped[list["Tool"]] = relationship(secondary="project_tool", back_populates="projects")
    images: Mapped[list["ProjectImage"]] = relationship("ProjectImage", back_populates="project")