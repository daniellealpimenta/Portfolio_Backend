from pydantic import BaseModel, ConfigDict, EmailStr, Field
from uuid import UUID


class RequestCodeIn(BaseModel):
    email: EmailStr


class RequestCodeOut(BaseModel):
    detail: str


class VerifyCodeIn(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class SignupIn(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr


class AuthUserOut(BaseModel):
    id: UUID
    name: str
    username: str | None
    email: str

    model_config = ConfigDict(from_attributes=True)
