from datetime import datetime, timezone

from fastapi import BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from Core.security import (
    create_session_token,
    generate_login_code,
    hash_login_code,
    login_code_expiry,
    validate_username,
    verify_login_code,
)
from Models.user import User
from Repositories.user import UserRepository
from Schemas.auth import SignupIn
from Schemas.user import UserCreate
from Services.email_service import send_login_code_email_task


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = UserRepository(db)

    def request_code(self, email: str, background_tasks: BackgroundTasks) -> dict:
        user = self.repository.get_by_email(email)
        if not user:
            raise HTTPException(status_code=404, detail="E-mail não encontrado.")

        code = generate_login_code()
        user.login_code_hash = hash_login_code(code)
        user.login_code_expires_at = login_code_expiry()
        self.db.commit()

        background_tasks.add_task(send_login_code_email_task, target_email=user.email, code=code)
        return {"detail": "Código enviado para o seu e-mail."}

    def verify_code(self, email: str, code: str) -> tuple[str, User]:
        user = self.repository.get_by_email(email)
        if not user or not user.login_code_hash or not user.login_code_expires_at:
            raise HTTPException(status_code=401, detail="Código inválido ou expirado.")

        expires_at = user.login_code_expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if datetime.now(timezone.utc) > expires_at or not verify_login_code(code, user.login_code_hash):
            raise HTTPException(status_code=401, detail="Código inválido ou expirado.")

        # Código de uso único: invalida assim que verificado, mesmo com sucesso
        user.login_code_hash = None
        user.login_code_expires_at = None
        self.db.commit()

        token = create_session_token(user.id)
        return token, user

    def signup(self, data: SignupIn) -> User:
        if self.repository.get_by_email(data.email):
            raise HTTPException(status_code=409, detail="Já existe uma conta com esse e-mail.")

        username = data.username.strip().lower()
        username_error = validate_username(username)
        if username_error:
            raise HTTPException(status_code=400, detail=username_error)
        if self.repository.get_by_username(username):
            raise HTTPException(status_code=409, detail="Esse nome de usuário já está em uso.")

        user_data = UserCreate(
            name=data.name.strip(),
            username=username,
            email=data.email,
        )
        return self.repository.create(user_data)

    def get_current_user(self, user_id) -> User:
        user = self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="Sessão inválida.")
        return user
