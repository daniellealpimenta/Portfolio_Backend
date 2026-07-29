from sqlalchemy.orm import Session
from Models.tool import Tool
from Schemas.tool import ToolCreate, ToolUpdate
from uuid import UUID

class ToolRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, tool_data: ToolCreate) -> Tool:
        nova_ferramenta = Tool(**tool_data.model_dump())
        self.db.add(nova_ferramenta)
        self.db.commit()
        self.db.refresh(nova_ferramenta)
        return nova_ferramenta

    def get_all(self) -> list[Tool]:
        return self.db.query(Tool).all()

    def get_by_id(self, tool_id: UUID) -> Tool | None:
        return self.db.query(Tool).filter(Tool.id == tool_id).first()

    def update(self, tool_id: UUID, tool_data: ToolUpdate) -> Tool | None:
        ferramenta = self.get_by_id(tool_id)
        if not ferramenta:
            return None

        for field, value in tool_data.model_dump(exclude_unset=True).items():
            setattr(ferramenta, field, value)

        self.db.commit()
        self.db.refresh(ferramenta)
        return ferramenta

    def delete(self, tool_id: UUID) -> bool:
        ferramenta = self.get_by_id(tool_id)
        if not ferramenta:
            return False

        self.db.delete(ferramenta)
        self.db.commit()
        return True
