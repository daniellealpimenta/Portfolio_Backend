import hashlib
import hmac
import os
import re
import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

SECRET_KEY = os.getenv("SESSION_SECRET_KEY", "")
if not SECRET_KEY:
    # Só acontece em dev sem .env configurado — nunca deve rodar assim em produção.
    print("AVISO: SESSION_SECRET_KEY não definida no .env — usando uma chave temporária (sessões não sobrevivem a um restart).")
    SECRET_KEY = secrets.token_hex(32)

_serializer = URLSafeTimedSerializer(SECRET_KEY, salt="admin-session")

SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60  # 7 dias
LOGIN_CODE_TTL_MINUTES = 10

RESERVED_USERNAMES = {
    "admin", "login", "logout", "api", "auth", "system", "static", "assets",
    "public", "www", "app", "root", "null", "undefined", "user", "users",
    "projects", "project", "about", "work", "resume", "index",
}

USERNAME_RE = re.compile(r"^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$")


def validate_username(username: str) -> str | None:
    """Retorna None se válido, ou uma mensagem de erro."""
    candidate = username.strip().lower()
    if not USERNAME_RE.match(candidate):
        return "Use de 3 a 30 caracteres: letras minúsculas, números, ponto, hífen ou underscore, começando e terminando com letra ou número."
    if candidate in RESERVED_USERNAMES:
        return "Esse nome de usuário é reservado pelo sistema."
    return None


def generate_login_code() -> str:
    """Código numérico de 6 dígitos, criptograficamente aleatório."""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_login_code(code: str) -> str:
    return hmac.new(SECRET_KEY.encode(), code.encode(), hashlib.sha256).hexdigest()


def verify_login_code(code: str, code_hash: str) -> bool:
    return hmac.compare_digest(hash_login_code(code), code_hash)


def login_code_expiry() -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=LOGIN_CODE_TTL_MINUTES)


def create_session_token(user_id: UUID) -> str:
    return _serializer.dumps(str(user_id))


def verify_session_token(token: str) -> UUID | None:
    try:
        raw = _serializer.loads(token, max_age=SESSION_MAX_AGE_SECONDS)
        return UUID(raw)
    except (BadSignature, SignatureExpired, ValueError):
        return None
