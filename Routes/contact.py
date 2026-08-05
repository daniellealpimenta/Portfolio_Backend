from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from Core.database import get_db
import Models.user as user_model
from Services.email_service import send_contact_email_task

router = APIRouter(
    prefix="/contact",
    tags=["Contact"]
)

class ContactFormRequest(BaseModel):
    user_id: str
    name: str
    email: str
    subject: str
    message: str

@router.post("/")
def submit_contact_form(request: ContactFormRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Buscar o usuário pelo user_id para pegar o e-mail cadastrado dele
    user = db.query(user_model.User).filter(user_model.User.id == request.user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuário do portfólio não encontrado.")
    
    # Adicionar tarefa à BackgroundTasks do FastAPI
    background_tasks.add_task(
        send_contact_email_task,
        name=request.name,
        email=request.email,
        subject=request.subject,
        message_body=request.message,
        target_email=user.email
    )
    
    return {"message": "Sua mensagem foi recebida e está sendo enviada."}
