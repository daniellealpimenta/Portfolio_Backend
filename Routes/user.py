from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

# Dependência do seu Core que abre a conexão com o banco
from Core.database import get_db

from Schemas.user import UserBase, UserCreate, UserResponse, UserUpdate
from Services.user import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Instancia o Service passando a conexão do banco
    service = UserService(db)
    
    # 2. Chama a função do service (que vai aplicar as regras e chamar o repo)
    usuario_criado = service.create_user(user_in)
    
    # 3. Retorna pro usuário (O FastAPI converte pro UserResponse magicamente)
    return usuario_criado

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_id(user_id)

@router.get("/email/{email}", response_model=UserResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_user_by_email(email)

@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    service = UserService(db)
    return service.get_all_users()

@router.patch("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, user_in: UserUpdate, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.update_user(user_id, user_in)

@router.delete("/{user_id}")
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    service = UserService(db)
    return service.delete_user(user_id)