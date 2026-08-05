from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Schemas.tool import ToolCreate, ToolResponse, ToolUpdate
from Services.tool import ToolService

router = APIRouter(prefix="/tools", tags=["Tools"])

@router.post("/", response_model=ToolResponse, status_code=201)
def create_tool(tool_in: ToolCreate, db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.create_tool(tool_in)

@router.get("/", response_model=list[ToolResponse])
def get_all_tools(db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.get_all_tools()

@router.get("/{tool_id}", response_model=ToolResponse)
def get_tool_by_id(tool_id: UUID, db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.get_tool_by_id(tool_id)

@router.get("/user/{user_id}", response_model=list[ToolResponse])
def get_tools_by_user(user_id: UUID, db: Session = Depends(get_db)):
    service = ToolService(db)
    # Tools are global, just return all tools for now
    return service.get_all_tools()

@router.patch("/{tool_id}", response_model=ToolResponse)
def update_tool(tool_id: UUID, tool_in: ToolUpdate, db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.update_tool(tool_id, tool_in)

@router.delete("/{tool_id}")
def delete_tool(tool_id: UUID, db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.delete_tool(tool_id)
