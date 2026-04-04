from sqlalchemy.orm import mapped_column, Mapped, relationship
from Models.base import BaseORMModel
from Models.project import Project
from Models.skill import Skill
from Models.experience import Experience
from Models.certificate import Certificate


class User(BaseORMModel):
    __tablename__ = "user"

    name: Mapped[str] = mapped_column(nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    main_phrase: Mapped[str] = mapped_column(nullable=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    phone_number: Mapped[str] = mapped_column(unique=True, nullable=False)
    url_linkedin: Mapped[str] = mapped_column(nullable=False)
    personality_test_url: Mapped[str] = mapped_column(nullable=True)
    curriculum_url: Mapped[str] = mapped_column(nullable=False)
    url_github: Mapped[str] = mapped_column(nullable=True)
    url_medium: Mapped[str] = mapped_column(nullable=True)
    url_instagram: Mapped[str] = mapped_column(nullable=True)

    # Relationships
    projects: Mapped[list["Project"]] = relationship("Project", back_populates="user")
    skills: Mapped[list["Skill"]] = relationship("Skill", back_populates="user")
    experiences: Mapped[list["Experience"]] = relationship("Experience", back_populates="user")
    certificates: Mapped[list["Certificate"]] = relationship("Certificate", back_populates="user")
