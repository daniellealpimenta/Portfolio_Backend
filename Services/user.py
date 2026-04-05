from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.user import UserRepository
from Schemas.user import UserBase, UserCreate, UserResponse, UserUpdate
from uuid import UUID

class UserService:
    def __init__(self, db: Session):
        # O Service instancia o Repository para poder usá-lo
        self.repository = UserRepository(db)

    def create_user(self, user_data: UserCreate):
        # Aqui você pode colocar regras de negócio, como validações
        if self.repository.get_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado")
        
        # Se passou nas regras, manda o repositório salvar
        return self.repository.create(user_data)
    
    def get_all_users(self):
        return self.repository.get_all()
    
    def get_user_by_email(self, email: str):
        user = self.repository.get_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return user

    def get_user_by_id(self, user_id: UUID):
        user = self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return user
    
    def update_user(self, user_id: UUID, user_data: UserUpdate):
        # Você pode colocar regras de negócio aqui também, como validação de email
        if user_data.email and self.repository.get_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado")
        
        updated_user = self.repository.update(user_id, user_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return updated_user
    
    def delete_user(self, user_id: UUID):
        success = self.repository.delete(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return {"detail": "Usuário deletado com sucesso"}