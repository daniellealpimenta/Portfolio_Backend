from fastapi import FastAPI

from Core.database import engine, Base
import Models.base
import Models.user        # Importe todas as suas models aqui para o SQLAlchemy "lê-las"
import Models.project     # antes de criar as tabelas
import Models.project_image
import Models.tool
import Models.associations
import Models.certificate
import Models.experience
import Models.skill
import Models.recommendation

# 2. Importação da sua Rota
# Supondo que você criou o arquivo Routes/project.py como conversamos
from Routes.project import router as project_router
from Routes.user import router as user_router

# 3. Criação das Tabelas no Banco (Supabase)
# Isso diz: "Olhe para todas as models importadas e crie as tabelas que faltam"
Base.metadata.create_all(bind=engine)

# 4. Inicialização do FastAPI
app = FastAPI(
    title="Portfolio API",
    description="Minha API profissional com FastAPI e Supabase",
    version="1.0.0"
)

# 5. Conectando as Rotas (Endpoints)
app.include_router(project_router)
app.include_router(user_router)

# Uma rota raiz só para testar se o servidor está no ar
@app.get("/")
def read_root():
    return {"message": "Servidor do Portfólio está rodando perfeitamente! 🚀"}