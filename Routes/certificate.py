from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Schemas.certificate import CertificateCreate, CertificateResponse, CertificateUpdate
from Services.certificate import CertificateService

router = APIRouter(prefix="/certificates", tags=["Certificates"])

@router.post("/", response_model=CertificateResponse, status_code=201)
def create_certificate(certificate_in: CertificateCreate, db: Session = Depends(get_db)):
    service = CertificateService(db)
    return service.create_certificate(certificate_in)

@router.get("/", response_model=list[CertificateResponse])
def get_all_certificates(db: Session = Depends(get_db)):
    service = CertificateService(db)
    return service.get_all_certificates()

@router.get("/{certificate_id}", response_model=CertificateResponse)
def get_certificate_by_id(certificate_id: UUID, db: Session = Depends(get_db)):
    service = CertificateService(db)
    return service.get_certificate_by_id(certificate_id)

@router.get("/user/{user_id}", response_model=list[CertificateResponse])
def get_certificates_by_user_id(user_id: UUID, db: Session = Depends(get_db)):
    service = CertificateService(db)
    return service.get_certificates_by_user_id(user_id)

@router.patch("/{certificate_id}", response_model=CertificateResponse)
def update_certificate(certificate_id: UUID, certificate_in: CertificateUpdate, db: Session = Depends(get_db)):
    service = CertificateService(db)
    return service.update_certificate(certificate_id, certificate_in)

@router.delete("/{certificate_id}")
def delete_certificate(certificate_id: UUID, db: Session = Depends(get_db)):
    service = CertificateService(db)
    return service.delete_certificate(certificate_id)
