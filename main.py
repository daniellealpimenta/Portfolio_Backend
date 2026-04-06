from fastapi import FastAPI

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

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Portfolio API",
    description="Minha API profissional com FastAPI e Supabase",
    version="1.0.0"
)

app.include_router(project_router)
app.include_router(user_router)

@app.get("/")
def read_root():
    return {"message": "Servidor do Portfólio está rodando perfeitamente!"}