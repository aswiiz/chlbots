import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class DatabaseService:
    def __init__(self):
        self.uri = os.getenv("MONGODB_URI")
        self.client = AsyncIOMotorClient(self.uri)
        self.db = self.client.get_database("smartnotes_ai")
        
        # Collections
        self.users = self.db.get_collection("users")
        self.projects = self.db.get_collection("projects")
        self.documents = self.db.get_collection("documents")
        self.mindmaps = self.db.get_collection("mindmaps")
        self.flashcards = self.db.get_collection("flashcards")
        self.chats = self.db.get_collection("chats")

    async def create_project(self, name: str, user_id: str) -> Dict[str, Any]:
        project = {
            "project_id": str(uuid.uuid4()),
            "name": name,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        }
        await self.projects.insert_one(project)
        return project

    async def add_document(self, project_id: str, content: str, filename: str) -> Dict[str, Any]:
        doc = {
            "document_id": str(uuid.uuid4()),
            "project_id": project_id,
            "content": content,
            "filename": filename,
            "created_at": datetime.utcnow()
        }
        await self.documents.insert_one(doc)
        return doc

    async def get_project_documents(self, project_id: str) -> List[Dict[str, Any]]:
        cursor = self.documents.find({"project_id": project_id})
        return await cursor.to_list(length=100)

    async def save_mindmap(self, project_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        result = await self.mindmaps.update_one(
            {"project_id": project_id},
            {"$set": {"data": data, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        return data

    async def get_mindmap(self, project_id: str) -> Optional[Dict[str, Any]]:
        return await self.mindmaps.find_one({"project_id": project_id})

    async def save_flashcards(self, project_id: str, cards: List[Dict[str, str]]) -> List[Dict[str, str]]:
        await self.flashcards.update_one(
            {"project_id": project_id},
            {"$set": {"cards": cards, "updated_at": datetime.utcnow()}},
            upsert=True
        )
        return cards

    async def get_flashcards(self, project_id: str) -> Optional[Dict[str, Any]]:
        return await self.flashcards.find_one({"project_id": project_id})

    async def update_chat_history(self, project_id: str, message: Dict[str, str]):
        await self.chats.update_one(
            {"project_id": project_id},
            {"$push": {"messages": {**message, "timestamp": datetime.utcnow()}}},
            upsert=True
        )

    async def get_chat_history(self, project_id: str) -> List[Dict[str, Any]]:
        history = await self.chats.find_one({"project_id": project_id})
        return history.get("messages", []) if history else []

db_service = DatabaseService()
