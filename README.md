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
