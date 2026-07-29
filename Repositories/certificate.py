from sqlalchemy.orm import Session
from Models.certificate import Certificate
from Schemas.certificate import CertificateCreate, CertificateUpdate
from uuid import UUID

class CertificateRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, certificate_data: CertificateCreate) -> Certificate:
        novo_certificado = Certificate(**certificate_data.model_dump())
        self.db.add(novo_certificado)
        self.db.commit()
        self.db.refresh(novo_certificado)
        return novo_certificado

    def get_all(self) -> list[Certificate]:
        return self.db.query(Certificate).all()

    def get_by_id(self, certificate_id: UUID) -> Certificate | None:
        return self.db.query(Certificate).filter(Certificate.id == certificate_id).first()

    def get_by_user_id(self, user_id: UUID) -> list[Certificate]:
        return self.db.query(Certificate).filter(Certificate.user_id == user_id).all()

    def get_by_url(self, digital_certificate_url: str) -> Certificate | None:
        return self.db.query(Certificate).filter(Certificate.digital_certificate_url == digital_certificate_url).first()

    def update(self, certificate_id: UUID, certificate_data: CertificateUpdate) -> Certificate | None:
        certificado = self.get_by_id(certificate_id)
        if not certificado:
            return None

        for field, value in certificate_data.model_dump(exclude_unset=True).items():
            setattr(certificado, field, value)

        self.db.commit()
        self.db.refresh(certificado)
        return certificado

    def delete(self, certificate_id: UUID) -> bool:
        certificado = self.get_by_id(certificate_id)
        if not certificado:
            return False

        self.db.delete(certificado)
        self.db.commit()
        return True
