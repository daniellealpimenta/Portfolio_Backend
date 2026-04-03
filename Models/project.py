from fastapi import FastAPI
from enum import Enum
from database import Base

from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, Date, ForeignKey
from uuid import uuid4
from datetime import date, datetime, timezone

app = FastAPI()

class Categories(str, Enum):
    FrontEnd = "FrontEnd"
    BackEnd = "BackEnd"
    FullStack = "FullStack"
    DataScience = "DataScience"
    GameDev = "GameDev"
    Mobile = "Mobile"
    Other = "Other"

class Project(Base):
    __tablename__ = "project"

    id: Mapped[str]  = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str]  = mapped_column(ForeignKey("user.id"))
    name:        Mapped[str]  = mapped_column(String(100))
    description: Mapped[str]  = mapped_column(String(500))
    link_github: Mapped[str]  = mapped_column(String(200))
    link_usage:  Mapped[str | None] = mapped_column(String(200))
    category:    Mapped[Categories]  = mapped_column(Categories)
    likes:       Mapped[int]  = mapped_column(Integer, default=0)
    created_at:  Mapped[date] = mapped_column(default=lambda: datetime.now(timezone.utc))

    # Relacionamento many-to-many com Tool via tabela de junção
    tools: Mapped[list["Tool"]] = relationship(secondary="projeto_ferramenta")

