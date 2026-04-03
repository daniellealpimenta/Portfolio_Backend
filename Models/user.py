from fastapi import FastAPI
from pydantic import EmailStr
from database import Base

from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship
from sqlalchemy import String, Integer, Date, ForeignKey
from uuid import uuid4
from datetime import date, datetime, timezone

app = FastAPI()

class User(Base):
    __tablename__ = "user"

    id: Mapped[str]  = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    name: str
    age: int
    description: str
    main_phrase: str
    email: EmailStr
    phone_number: str
    url_linkedin: str
    personality_test_url: str
    curriculum_url: str
    url_github: str
    url_medium: str
    url_instagram: str
