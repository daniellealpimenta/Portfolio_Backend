from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Dict, Any

from Core.database import get_db
from Core.deps import get_current_user
from Models.user import User
from Services.system import SystemService

router = APIRouter(prefix="/system", tags=["System"])

@router.post("/import/{user_id}")
def import_system_data(user_id: UUID, data: Dict[str, Any], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Só é possível importar dados pra sua própria conta")
    service = SystemService(db)
    return service.import_system_data(user_id, data)

@router.get("/export/{user_id}")
def export_system_data(user_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Só é possível exportar dados da sua própria conta")
    service = SystemService(db)
    return service.export_system_data(user_id)
