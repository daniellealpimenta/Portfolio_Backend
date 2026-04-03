from fastapi import FastAPI
from database import Base

from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, Date, ForeignKey
from uuid import uuid4
from datetime import date, datetime, timezone

app = FastAPI()

class Tool(Base):
    __tablename__ = "tool"

    id: Mapped[str]  = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    name:        Mapped[str]  = mapped_column(String(100))
    url_icon:       Mapped[str]  = mapped_column(String(200))
    created_at:  Mapped[date] = mapped_column(default=lambda: datetime.now(timezone.utc))

    # Relacionamento many-to-many com Tool via tabela de junção
    project: Mapped[list["Project"]] = relationship(secondary="projeto_ferramenta")
