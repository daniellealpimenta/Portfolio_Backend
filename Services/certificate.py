from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.certificate import CertificateRepository
from Schemas.certificate import CertificateCreate, CertificateUpdate
from uuid import UUID

class CertificateService:
    def __init__(self, db: Session):
        self.repository = CertificateRepository(db)

    def create_certificate(self, certificate_data: CertificateCreate, current_user_id: UUID):
        certificate_data.user_id = current_user_id

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
        return self.repository.get_by_user_id(user_id)

    def update_certificate(self, certificate_id: UUID, certificate_data: CertificateUpdate, current_user_id: UUID):
        certificate = self.get_certificate_by_id(certificate_id)
        if certificate.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar esse certificado")

        if certificate_data.digital_certificate_url:
            existing = self.repository.get_by_url(certificate_data.digital_certificate_url)
            if existing and existing.id != certificate_id:
                raise HTTPException(status_code=400, detail="URL de certificado digital já cadastrada por outro certificado")

        updated = self.repository.update(certificate_id, certificate_data)
        return updated

    def delete_certificate(self, certificate_id: UUID, current_user_id: UUID):
        certificate = self.get_certificate_by_id(certificate_id)
        if certificate.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para excluir esse certificado")

        self.repository.delete(certificate_id)
        return {"detail": "Certificado deletado com sucesso"}
