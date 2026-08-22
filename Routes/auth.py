from fastapi import APIRouter, BackgroundTasks, Depends, Request, Response
from sqlalchemy.orm import Session

from Core.database import get_db
from Core.deps import SESSION_COOKIE_NAME, get_current_user
from Core.limiter import limiter
from Core.security import SESSION_MAX_AGE_SECONDS
from Models.user import User
from Schemas.auth import AuthUserOut, RequestCodeIn, RequestCodeOut, SignupIn, VerifyCodeIn
from Schemas.user import UserResponse
from Services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/request-code", response_model=RequestCodeOut)
@limiter.limit("5/minute")
def request_code(request: Request, body: RequestCodeIn, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.request_code(body.email, background_tasks)


@router.post("/verify-code", response_model=AuthUserOut)
@limiter.limit("10/minute")
def verify_code(request: Request, body: VerifyCodeIn, response: Response, db: Session = Depends(get_db)):
    service = AuthService(db)
    token, user = service.verify_code(body.email, body.code)

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        max_age=SESSION_MAX_AGE_SECONDS,
        httponly=True,
        samesite="lax",
        secure=False,  # trocar para True quando estiver servido atrás de HTTPS
        path="/",
    )
    return user


@router.post("/signup", response_model=AuthUserOut, status_code=201)
@limiter.limit("3/hour")
def signup(request: Request, body: SignupIn, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.signup(body)
    # Já dispara o código de verificação pro e-mail recém-cadastrado
    service.request_code(user.email, background_tasks)
    return user


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    # Endpoint autenticado — só devolve dados de quem está logado, por isso
    # pode incluir o perfil completo (e-mail, telefone), diferente do
    # GET /users/{identifier} público, que é enxuto de propósito.
    return current_user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE_NAME, path="/")
    return {"detail": "Sessão encerrada."}
