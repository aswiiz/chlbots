# 🚀 SmartNotes AI
**The AI-Powered Research Hub & Study Assistant**

SmartNotes AI transforms your documents, URLs, and notes into an interactive knowledge base. Built with **FastAPI**, **React**, **MongoDB**, and powered by the **SambaNova AI API**.

## ✨ Key Features
- **Knowledge Base**: Upload PDF, DOCX, TXT, or import via URL.
- **AI Mind Maps**: Dynamically generate hierarchical knowledge graphs from your notes.
- **Process Flowcharts**: Extract sequences and logic into Mermaid.js diagrams.
- **Study Flashcards**: AI-generated cards with a 3D flip animation system.
- **Contextual Chat**: Ask the AI anything about your specific uploaded documents.
- **Premium UI**: Modern dark-mode design with glassmorphism and smooth animations.

## 🛠️ Tech Stack
- **Backend**: Python (FastAPI), Motor (Async MongoDB), PyMuPDF, OpenAI SDK (SambaNova compat).
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React Flow, Mermaid.js.
- **Database**: MongoDB Atlas.
- **LLM**: SambaNova (Meta-Llama-3.1-405B).

## 🚦 Quick Start

### 1. Project Setup
```bash
git clone <your-repo>
cd smartnotes-ai
```

### 2. Backend Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the root (using `.env.template`) and add your:
- `SAMBANOVA_API_KEY`
- `MONGODB_URI`

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```

### 4. Running the App
- Backend starts on `http://localhost:8000`
- Frontend starts on `http://localhost:5173`

## 💎 Design Philosophy
SmartNotes AI uses a **high-contrast dark aesthetic** with **glassmorphic** UI elements. We prioritize readability and interactive feedback to make studying more engaging.
- **Typography**: Inter (UI) & Outfit (Headers) via Google Fonts.
- **Colors**: Deep Charcoals, Neon Primaries (Sky Blue), and subtle transparency.

---
Built with ❤️ for Scholars & Researchers.

---

## 🚀 Deployment Guide

This project is set up for a dual-host deployment: **Frontend on Vercel** and **Backend on Render**.

### 1. Backend (Render.com)
1. **Create a New Web Service** on Render.
2. Link your GitHub repository.
3. Set **Root Directory** to `backend`.
4. **Environment**: `Python`
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
7. Add **Environment Variables**:
   - `SAMBANOVA_API_KEY`: Your API Key
   - `MONGODB_URI`: Your MongoDB Atlas URI

### 2. Frontend (Vercel)
1. **Create a New Project** on Vercel.
2. Link your GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Vercel will auto-detect Vite.
5. Add **Environment Variable**:
   - `VITE_API_URL`: The URL of your Render backend (e.g., `https://smartnotes-api.onrender.com/api`)
6. Deploy!

### 🏗️ Monorepo Structure
```text
.
├── backend/          # FastAPI Backend (Render)
├── frontend/         # React/Vite Frontend (Vercel)
├── .gitignore        # Shared gitignore
└── README.md
```
