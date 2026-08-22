from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from Core.database import get_db
from Core.deps import get_current_user
from Models.user import User
from Schemas.tool import ToolCreate, ToolResponse, ToolUpdate
from Services.tool import ToolService

router = APIRouter(prefix="/tools", tags=["Tools"])

@router.post("/", response_model=ToolResponse, status_code=201)
def create_tool(tool_in: ToolCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.create_tool(tool_in, current_user.id)

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
    return service.get_tools_by_user_id(user_id)

@router.patch("/{tool_id}", response_model=ToolResponse)
def update_tool(tool_id: UUID, tool_in: ToolUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.update_tool(tool_id, tool_in, current_user.id)

@router.delete("/{tool_id}")
def delete_tool(tool_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ToolService(db)
    return service.delete_tool(tool_id, current_user.id)
