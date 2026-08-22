from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Core.limiter import limiter
from Schemas.resume_analysis import ResumeAnalysisOut
from Services.resume_analysis import ResumeAnalysisService

router = APIRouter(prefix="/resume-analysis", tags=["Resume Analysis"])

# Público (a página /resume já é pública) — mas limitado, já que cada chamada
# baixa e processa um PDF externo.
@router.get("/{user_id}", response_model=ResumeAnalysisOut)
@limiter.limit("10/minute")
def analyze_resume(request: Request, user_id: UUID, lang: str = "pt", db: Session = Depends(get_db)):
    service = ResumeAnalysisService(db)
    return service.analyze(user_id, lang)
