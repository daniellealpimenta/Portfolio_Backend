from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.tool import ToolRepository
from Schemas.tool import ToolCreate, ToolUpdate
from uuid import UUID

class ToolService:
    def __init__(self, db: Session):
        self.repository = ToolRepository(db)

    def create_tool(self, tool_data: ToolCreate):
        return self.repository.create(tool_data)

    def get_all_tools(self):
        return self.repository.get_all()

    def get_tool_by_id(self, tool_id: UUID):
        tool = self.repository.get_by_id(tool_id)
        if not tool:
            raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
        return tool

    def get_tools_by_user_id(self, user_id: UUID):
        from Repositories.user import UserRepository
        user_repo = UserRepository(self.repository.db)
        if not user_repo.get_by_id(user_id):
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return self.repository.get_by_user_id(user_id)

    def update_tool(self, tool_id: UUID, tool_data: ToolUpdate):
        updated = self.repository.update(tool_id, tool_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
        return updated

    def delete_tool(self, tool_id: UUID):
        success = self.repository.delete(tool_id)
        if not success:
            raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
        return {"detail": "Ferramenta deletada com sucesso"}
