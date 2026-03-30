from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
import uuid
from services.db_service import db_service
from services.file_service import file_service
from services.sambanova_service import sambanova_service

router = APIRouter()

@router.post("/projects")
async def create_project(name: str = Form(...), user_id: str = Form(...)): # Simplified for now
    return await db_service.create_project(name, user_id)

@router.get("/projects/{user_id}")
async def list_projects(user_id: str):
    cursor = db_service.projects.find({"user_id": user_id})
    return await cursor.to_list(length=100)

@router.post("/upload")
async def upload_document(
    project_id: str = Form(...), 
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    url: Optional[str] = Form(None)
):
    content = ""
    filename = ""
    
    if file:
        filename = file.filename
        file_content = await file.read()
        if filename.endswith(".pdf"):
            content = await file_service.extract_pdf_text(file_content)
        elif filename.endswith(".docx"):
            content = await file_service.extract_docx_text(file_content)
        elif filename.endswith(".txt"):
            content = await file_service.extract_txt_text(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
    elif text:
        content = text
        filename = "pasted_text_" + str(uuid.uuid4())[:8]
    elif url:
        content = await file_service.extract_url_text(url)
        filename = url
    else:
        raise HTTPException(status_code=400, detail="No source provided")
    
    await db_service.add_document(project_id, content, filename)
    return {"message": "Document uploaded successfully", "filename": filename}

@router.get("/documents/{project_id}")
async def get_documents(project_id: str):
    return await db_service.get_project_documents(project_id)

@router.post("/generate-mindmap")
async def generate_mindmap(project_id: str = Form(...)):
    docs = await db_service.get_project_documents(project_id)
    if not docs:
        raise HTTPException(status_code=404, detail="No documents found for this project")
    
    # Combine all docs into one text chunk
    combined_content = "\n\n".join([doc["content"] for doc in docs])
    mindmap = await sambanova_service.generate_mindmap(combined_content)
    await db_service.save_mindmap(project_id, mindmap)
    return mindmap

@router.post("/generate-flowchart")
async def generate_flowchart(project_id: str = Form(...)):
    docs = await db_service.get_project_documents(project_id)
    if not docs:
        raise HTTPException(status_code=404, detail="No documents found for this project")
    
    combined_content = "\n\n".join([doc["content"] for doc in docs])
    mermaid_code = await sambanova_service.generate_flowchart(combined_content)
    return {"mermaid": mermaid_code}

@router.post("/generate-flashcards")
async def generate_flashcards(project_id: str = Form(...)):
    docs = await db_service.get_project_documents(project_id)
    if not docs:
        raise HTTPException(status_code=404, detail="No documents found for this project")
    
    combined_content = "\n\n".join([doc["content"] for doc in docs])
    cards = await sambanova_service.generate_flashcards(combined_content)
    await db_service.save_flashcards(project_id, cards)
    return cards

@router.post("/chat")
async def chat(project_id: str = Form(...), question: str = Form(...)):
    docs = await db_service.get_project_documents(project_id)
    if not docs:
        raise HTTPException(status_code=404, detail="No documents found for this project")
    
    combined_content = "\n\n".join([doc["content"] for doc in docs])
    history = await db_service.get_chat_history(project_id)
    
    # Format history for SambaNova (list of dicts with role and content)
    formatted_history = [{"role": m["role"], "content": m["content"]} for m in history]
    
    response = await sambanova_service.chat_with_context(question, combined_content, formatted_history)
    
    # Save both messages to history
    await db_service.update_chat_history(project_id, {"role": "user", "content": question})
    await db_service.update_chat_history(project_id, {"role": "assistant", "content": response})
    
    return {"response": response, "history": await db_service.get_chat_history(project_id)}

@router.get("/mindmap/{project_id}")
async def get_mindmap(project_id: str):
    return await db_service.get_mindmap(project_id)

@router.get("/flashcards/{project_id}")
async def get_flashcards(project_id: str):
    return await db_service.get_flashcards(project_id)

@router.get("/chat-history/{project_id}")
async def get_chat_history(project_id: str):
    return await db_service.get_chat_history(project_id)
