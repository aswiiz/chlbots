from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectBase(BaseModel):
    name: str

class Project(ProjectBase):
    project_id: str
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Document(BaseModel):
    document_id: str
    project_id: str
    content: str
    filename: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MindMap(BaseModel):
    project_id: str
    data: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Flashcard(BaseModel):
    question: str
    answer: str

class FlashcardSet(BaseModel):
    project_id: str
    cards: List[Flashcard]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatHistory(BaseModel):
    project_id: str
    messages: List[ChatMessage]
