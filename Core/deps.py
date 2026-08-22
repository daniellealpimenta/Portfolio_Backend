from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from Core.database import get_db
from Core.security import verify_session_token
from Models.user import User

SESSION_COOKIE_NAME = "admin_session"


def get_current_user(
    admin_session: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> User:
    if not admin_session:
        raise HTTPException(status_code=401, detail="Não autenticado.")

    user_id = verify_session_token(admin_session)
    if not user_id:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Sessão inválida.")

    return user
