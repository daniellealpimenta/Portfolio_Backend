from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Core.database import engine, Base
import Models.base
import Models.user        
import Models.project     
import Models.project_image
import Models.tool
import Models.associations
import Models.certificate
import Models.experience
import Models.skill
import Models.recommendation

from Routes.project import router as project_router
from Routes.user import router as user_router
from Routes.project_image import router as project_image_router
from Routes.skill import router as skill_router
from Routes.tool import router as tool_router
from Routes.experience import router as experience_router
from Routes.certificate import router as certificate_router
from Routes.recommendation import router as recommendation_router
from Routes.contact import router as contact_router
from Routes.system import router as system_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portfolio API",
    description="Minha API profissional com FastAPI e Supabase",
    version="1.0.0"
)

# Habilitar CORS para o Frontend (Navegador)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite requisições de qualquer origem local ou de produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(project_router)
app.include_router(project_image_router)
app.include_router(skill_router)
app.include_router(tool_router)
app.include_router(experience_router)
app.include_router(certificate_router)
app.include_router(recommendation_router)
app.include_router(contact_router)
app.include_router(system_router)

@app.get("/")
def read_root():
    return {"message": "Servidor do Portfólio está rodando perfeitamente!"}