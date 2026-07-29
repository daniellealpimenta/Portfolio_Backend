from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date as Date, datetime
from uuid import UUID

class CertificateBase(BaseModel):
    name_course: str
    plataform: str
    workload: int
    issue_date: Date
    digital_certificate_url: str
    description: Optional[str] = None

class CertificateCreate(CertificateBase):
    user_id: UUID

class CertificateUpdate(BaseModel):
    name_course: Optional[str] = None
    plataform: Optional[str] = None
    workload: Optional[int] = None
    issue_date: Optional[Date] = None
    digital_certificate_url: Optional[str] = None
    description: Optional[str] = None

class CertificateResponse(CertificateBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
