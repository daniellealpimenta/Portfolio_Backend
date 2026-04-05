from datetime import date
from sqlalchemy.orm import mapped_column, Mapped, relationship
from Models.base import BaseORMModel
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from Models.project import Project
    from Models.experience import Experience
    from Models.certificate import Certificate
    from Models.skill import Skill
    from Models.recommendation import Recommendation


class User(BaseORMModel):
    __tablename__ = "user"

    name: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    birth_date: Mapped[date] = mapped_column(nullable=False)
    main_phrase: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    cellphone_number: Mapped[str] = mapped_column(nullable=True, unique=True)
    avatar_url: Mapped[str] = mapped_column(nullable=False)
    linkedin_url: Mapped[str] = mapped_column(nullable=False, unique=True)
    github_url: Mapped[str] = mapped_column(nullable=True, unique=True)
    medium_url: Mapped[str] = mapped_column(nullable=True, unique=True)
    instagram_url: Mapped[str] = mapped_column(nullable=True, unique=True)
    personality_test_url: Mapped[str] = mapped_column(nullable=True, unique=True)
    curriculum_url: Mapped[str] = mapped_column(nullable=False, unique=True)

    # Relationships
    projects: Mapped[list["Project"]] = relationship("Project", back_populates="user")
    skills: Mapped[list["Skill"]] = relationship("Skill", back_populates="user")
    experiences: Mapped[list["Experience"]] = relationship("Experience", back_populates="user")
    certificates: Mapped[list["Certificate"]] = relationship("Certificate", back_populates="user")
    recommendations: Mapped[list["Recommendation"]] = relationship("Recommendation", back_populates="user")
