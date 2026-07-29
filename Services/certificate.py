from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.certificate import CertificateRepository
from Repositories.user import UserRepository
from Schemas.certificate import CertificateCreate, CertificateUpdate
from uuid import UUID

class CertificateService:
    def __init__(self, db: Session):
        self.repository = CertificateRepository(db)

    def create_certificate(self, certificate_data: CertificateCreate):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(certificate_data.user_id):
            raise HTTPException(status_code=400, detail="Usuário associado não existe")

        if self.repository.get_by_url(certificate_data.digital_certificate_url):
            raise HTTPException(status_code=400, detail="URL de certificado digital já cadastrada")

        return self.repository.create(certificate_data)

    def get_all_certificates(self):
        return self.repository.get_all()

    def get_certificate_by_id(self, certificate_id: UUID):
        certificate = self.repository.get_by_id(certificate_id)
        if not certificate:
            raise HTTPException(status_code=404, detail="Certificado não encontrado")
        return certificate

    def get_certificates_by_user_id(self, user_id: UUID):
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(user_id):
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return self.repository.get_by_user_id(user_id)

    def update_certificate(self, certificate_id: UUID, certificate_data: CertificateUpdate):
        if certificate_data.digital_certificate_url:
            existing = self.repository.get_by_url(certificate_data.digital_certificate_url)
            if existing and existing.id != certificate_id:
                raise HTTPException(status_code=400, detail="URL de certificado digital já cadastrada por outro certificado")

        updated = self.repository.update(certificate_id, certificate_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Certificado não encontrado")
        return updated

    def delete_certificate(self, certificate_id: UUID):
        success = self.repository.delete(certificate_id)
        if not success:
            raise HTTPException(status_code=404, detail="Certificado não encontrado")
        return {"detail": "Certificado deletado com sucesso"}
