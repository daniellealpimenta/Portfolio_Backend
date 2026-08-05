from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Dict, Any

from Core.database import get_db
from Services.system import SystemService

router = APIRouter(prefix="/system", tags=["System"])

@router.post("/import/{user_id}")
def import_system_data(user_id: UUID, data: Dict[str, Any], db: Session = Depends(get_db)):
    service = SystemService(db)
    return service.import_system_data(user_id, data)

@router.get("/export/{user_id}")
def export_system_data(user_id: UUID, db: Session = Depends(get_db)):
    service = SystemService(db)
    return service.export_system_data(user_id)
