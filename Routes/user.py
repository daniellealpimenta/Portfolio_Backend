from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

# Dependência do seu Core que abre a conexão com o banco
from Core.database import get_db
from Core.deps import get_current_user

from Models.user import User
from Schemas.user import UserPublicResponse, UserUpdate
from Services.user import UserService

router = APIRouter(prefix="/users", tags=["Users"])

# Criação de conta passou a ser feita via /auth/signup (com validação de
# username, checagem de nomes reservados e confirmação por código de e-mail).

@router.get("/{identifier}", response_model=UserPublicResponse)
def get_user(identifier: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_identifier(identifier)

@router.patch("/{user_id}", response_model=UserPublicResponse)
def update_user(user_id: UUID, user_in: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Só é possível editar o seu próprio perfil")
    service = UserService(db)
    return service.update_user(user_id, user_in)

@router.delete("/{user_id}")
def delete_user(user_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Só é possível excluir a sua própria conta")
    service = UserService(db)
    return service.delete_user(user_id)
