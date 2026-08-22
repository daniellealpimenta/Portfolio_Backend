from sqlalchemy.orm import Session
from fastapi import HTTPException
from Repositories.tool import ToolRepository
from Schemas.tool import ToolCreate, ToolUpdate
from uuid import UUID

class ToolService:
    def __init__(self, db: Session):
        self.repository = ToolRepository(db)

    def create_tool(self, tool_data: ToolCreate, current_user_id: UUID):
        tool_data.user_id = current_user_id
        return self.repository.create(tool_data)

    def get_all_tools(self):
        return self.repository.get_all()

    def get_tool_by_id(self, tool_id: UUID):
        tool = self.repository.get_by_id(tool_id)
        if not tool:
            raise HTTPException(status_code=404, detail="Ferramenta não encontrada")
        return tool

    def get_tools_by_user_id(self, user_id: UUID):
        return self.repository.get_by_user_id(user_id)

    def update_tool(self, tool_id: UUID, tool_data: ToolUpdate, current_user_id: UUID):
        tool = self.get_tool_by_id(tool_id)
        if tool.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar essa ferramenta")

        updated = self.repository.update(tool_id, tool_data)
        return updated

    def delete_tool(self, tool_id: UUID, current_user_id: UUID):
        tool = self.get_tool_by_id(tool_id)
        if tool.user_id != current_user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para excluir essa ferramenta")

        self.repository.delete(tool_id)
        return {"detail": "Ferramenta deletada com sucesso"}
