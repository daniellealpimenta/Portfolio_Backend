from sqlalchemy.orm import Session
from Models.user import User
from Schemas.user import UserBase, UserCreate, UserResponse, UserUpdate
from uuid import UUID

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_data: UserCreate) -> User:
        novo_usuario = User(**user_data.model_dump())
        self.db.add(novo_usuario)
        self.db.commit()
        self.db.refresh(novo_usuario)
        return novo_usuario
    
    def get_all(self) -> list[User]:
        return self.db.query(User).all()
    
    def get_by_id(self, user_id: UUID) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()
    
    def update(self, user_id: UUID, user_data: UserUpdate) -> User | None:
        usuario = self.get_by_id(user_id)
        if not usuario:
            return None
        
        for field, value in user_data.model_dump(exclude_unset=True).items():
            setattr(usuario, field, value)
        
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
    
    def delete(self, user_id: UUID) -> bool:
        usuario = self.get_by_id(user_id)
        if not usuario:
            return False
        
        self.db.delete(usuario)
        self.db.commit()
        return True