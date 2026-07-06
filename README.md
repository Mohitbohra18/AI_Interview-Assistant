#  AI Interview Coach

> **B.Tech Final Year Major Project**
> Built by Sanjana Saxena , Rudransh Mohan Srivastava and Mohit Bohra.
> Department of Computer Science & Engineering
> Graphic Era Hill University, Dehradun
 Under the Guidance of **Mrs. Manisha Aeri**

---

## 📌 Project Overview

**AI Interview Coach** is an intelligent, full-stack interview preparation platform that simulates real-world job interviews using local Large Language Models (LLMs). The system analyzes a candidate's resume and a given job description, then conducts a structured, multi-phase interview — complete with voice interaction, real-time answer evaluation, and a detailed performance report.

The platform removes the need for expensive cloud-based AI APIs by leveraging **Ollama** (a local LLM runtime) to run powerful models like **DeepSeek-V3** directly on the user's machine, ensuring privacy and zero per-query costs.

---

## 🎯 Key Features

- **📄 Resume & JD Analysis** — Upload your resume (PDF/image) and job description; the system uses OCR (Tesseract) to extract and understand your background and the role requirements.
- **🎙️ Voice-Enabled Interview** — The AI interviewer speaks questions aloud using Microsoft Edge TTS (`en-IN-NeerjaNeural` voice) and listens to your answers via microphone using OpenAI Whisper.
- **🧠 Multi-Phase Interview Flow** — Automatically progresses through an Introduction phase, a Technical phase (10 DSA + project questions), and a Behavioral phase (5 STAR-method questions).
- **📊 Real-Time Answer Scoring** — Every answer is evaluated on a strict 0–10 scale by the LLM, with actionable 1–2 line feedback comparing your response to an ideal answer.
- **📈 Performance Analytics** — A dedicated Feedback page shows your overall score, per-question breakdown, category scores (verbal, technical), and an improvement chart over multiple sessions.
- **📉 Growth Dashboard** — Track your progress across multiple interview sessions with an interactive area chart, session history table, and filter controls.
- **🌓 Dark / Light Theme** — Seamless theme toggle with warm, glassmorphism-inspired UI throughout.
- **💻 Live Camera Feed** — The interview room shows your live webcam preview alongside a microphone level visualizer for a realistic interview feel.
- **✍️ Text & Voice Input** — Candidates can answer via voice (transcribed by Whisper) or type their response directly — ideal for coding questions.
- **🔒 Fully Local & Private** — All AI inference runs locally via Ollama; no resume or answer data is sent to any external server.

---

## 🏗️ Project Architecture

```
AI-Interview-Coach/
│
├── backend/                        # Python backend (FastAPI + Streamlit)
│   ├── main.py                     # FastAPI REST API server
│   ├── abcd.py                     # Standalone Streamlit app (prototype)
│   ├── voice_interviewer.py        # TTS (Edge TTS) + STT (Whisper) module
│   ├── ngrok.py                    # Ngrok tunnel for public URL sharing
│   ├── requirement.txt             # Python dependencies
│   ├── test_upload.py              # API endpoint test script
│   ├── test_chat.py                # Full chat loop test script
│   └── test_pdf2image.py           # Poppler/pdf2image diagnostic script
│
└── frontend/                       # React + TypeScript frontend (Vite)
    ├── src/
    │   ├── App.tsx                 # Root component & routing
    │   ├── main.tsx                # React entry point
    │   ├── style.css               # Global styles & Tailwind directives
    │   ├── components/
    │   │   └── Navbar.tsx          # Navigation bar with theme toggle
    │   ├── contexts/
    │   │   ├── ThemeContext.tsx    # Dark/light theme state
    │   │   └── InterviewContext.tsx# Global interview session state
    │   └── pages/
    │       ├── LandingPage.tsx     # Hero & feature showcase
    │       ├── UploadPage.tsx      # Resume & JD file upload
    │       ├── LoadingPage.tsx     # Animated loading while API initializes
    │       ├── InterviewRoom.tsx   # Live interview UI (main experience)
    │       ├── FeedbackPage.tsx    # Score, feedback & charts
    │       ├── DashboardPage.tsx   # Progress tracking & session history
    │       └── SetupPage.tsx       # Interview type & difficulty config
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── vite.config.ts              # Dev server with API proxy to backend
```

---

## 🔄 System Workflow

```
User Uploads Resume + Job Description
            │
            ▼
   OCR Extraction (Tesseract + Poppler)
            │
            ▼
   Session Created (FastAPI backend)
            │
            ▼
   ┌─────────────────────────────────┐
   │        Interview Phases         │
   │                                 │
   │  1. INTRO  →  Self-introduction │
   │  2. TECH   →  10 DSA/Project Qs │
   │  3. BEHAV  →  5 STAR Qs         │
   │  4. ENDED  →  Goodbye message   │
   └─────────────────────────────────┘
            │
            ▼
   LLM generates question (Ollama / DeepSeek-V3)
            │
            ▼
   TTS speaks question (Edge TTS)
            │
            ▼
   Candidate answers (Voice via Whisper / Text input)
            │
            ▼
   LLM evaluates answer → Score (0–10) + Feedback
            │
            ▼
   FeedbackPage: Performance Summary & Analytics
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Python 3.10+** | Core backend language |
| **FastAPI** | REST API server |
| **Streamlit** | Standalone prototype UI |
| **Ollama + DeepSeek-V3 671B** | Local LLM inference |
| **LangChain (Ollama + Core)** | LLM prompt chaining |
| **Tesseract OCR** | Text extraction from resume images |
| **Poppler + pdf2image** | PDF to image conversion for OCR |
| **OpenAI Whisper** | Speech-to-text (answer transcription) |
| **Microsoft Edge TTS** | Text-to-speech (interviewer voice) |
| **webrtcvad** | Voice activity detection for mic input |
| **sounddevice / scipy** | Audio recording |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Performance charts & analytics |
| **Lucide React** | Icon library |
| **React Router v7** | Client-side navigation |

---

## ⚙️ Installation & Setup

### Prerequisites

Before running the project, install the following system-level tools:

#### 1. Ollama (Local LLM Runtime)
- Download from [ollama.com](https://ollama.com) and install.
- Pull the required model:
  ```bash
  ollama pull deepseek-v3.1:671b-cloud
  ```

#### 2. Tesseract OCR
- Download and install the [Windows Installer](https://github.com/UB-Mannheim/tesseract/wiki).
- Install to the default path: `C:\Program Files\Tesseract-OCR`

#### 3. Poppler (PDF Processing)
- Download the [Poppler ZIP](https://github.com/oschwartz10612/poppler-windows/releases/).
- Extract to `C:\Program Files\poppler`.
- Ensure this path exists: `C:\Program Files\poppler\poppler-24.02.0\Library\bin`

---

### Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install all Python dependencies
pip install -r requirement.txt

# Verify your Poppler path in main.py matches your installation
# POPPLER_PATH = r"C:\Program Files\poppler-25.12.0\Library\bin"

# Start the FastAPI server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

---

### Frontend Setup

```bash
# Navigate to the frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend dev server proxies all `/api` requests to `http://127.0.0.1:8000` automatically (configured in `vite.config.ts`).

Open your browser and navigate to: **http://localhost:5173**

---

### (Optional) Streamlit Standalone App

If you want to run the original Streamlit prototype instead of the full-stack app:

```bash
cd backend
streamlit run abcd.py
```

---

## 📖 How to Use

1. **Open the app** at `http://localhost:5173` (ensure both backend and frontend are running).
2. **Navigate to "New Interview"** from the navbar.
3. **Upload your Resume** (PDF or image) and your **Job Description** file.
4. **Select your role** and **experience level**, then click **"Generate Interview Plan"**.
5. Wait on the **Loading Page** while the system analyzes your documents and initializes the AI.
6. **Click "Allow & Start"** in the Interview Room to begin.
7. **Listen** to the AI interviewer's question (spoken aloud) and **type or speak** your answer.
8. Click **"Submit & Next"** after each answer to receive a score and move to the next question.
9. After all questions are completed, you are redirected to the **Feedback Page**.
10. View your **overall score**, **per-question breakdown**, and **improvement suggestions**, then explore your **Dashboard** to track progress over time.

---

## 🔌 API Reference

The backend exposes the following REST endpoints:

### `GET /api/health`
Health check. Returns `{ "status": "ok" }`.

### `POST /api/upload`
Initializes a new interview session.

**Form Data:**
| Field | Type | Description |
|---|---|---|
| `resume` | File | Candidate's resume (PDF or image) |
| `job_description_file` | File | Job description (PDF, image, or text) |
| `role` | string | Target role (e.g., "Software Engineer") |
| `experience` | string | Experience level (e.g., "mid") |

**Response:**
```json
{
  "session_id": "<uuid>",
  "initial_question": "Hello! Welcome...",
  "audio_base64": "<base64-encoded mp3>",
  "phase": "intro"
}
```

### `POST /api/chat`
Submits a candidate's answer and receives the next question.

**Request Body:**
```json
{
  "session_id": "<uuid>",
  "user_answer": "My name is..."
}
```

**Response:**
```json
{
  "ai_text": "Great! Now let's talk about...",
  "audio_base64": "<base64-encoded mp3>",
  "score": 8.5,
  "feedback": "Good explanation, but consider mentioning time complexity.",
  "phase": "technical",
  "is_ended": false
}
```

---

## 📂 Interview Phase Logic

| Phase | Trigger | Questions |
|---|---|---|
| `intro` | Session start | 1 (self-introduction) |
| `technical` | After intro answer | Up to 10 (DSA + projects) |
| `behavioral` | After 10 tech questions | Up to 5 (STAR method) |
| `ended` | After 5 behavioral questions or manual end | 1 (goodbye) |

Phase transitions are managed server-side in `main.py` and tracked in the frontend via `InterviewContext`.

---

## 🎨 UI Design System

The frontend uses a warm, welcoming color palette with glassmorphism effects:

| Token | Light Mode | Dark Mode |
|---|---|---|
| Primary | Coral `#FF6B6B` | Coral Light `#FF8787` |
| Secondary | Peach `#FFA94D` | Peach `#FFA94D` |
| Background | Cream `#FFF8F3` | Charcoal `#1A1A1D` |
| Text | Warm Gray `#2D3436` | Warm White `#FAF3E0` |

Typography uses **Outfit** for body text and **Space Grotesk** for headings.

---

## 🧪 Testing

Run the provided test scripts to verify the backend is working correctly:

```bash
# Test the upload endpoint
python test_upload.py

# Test a full multi-turn chat loop
python test_chat.py

# Verify Poppler / pdf2image installation
python test_pdf2image.py
```

---

## 🚀 Deployment (Public Sharing via Ngrok)

To share the Streamlit app publicly during demos:

```bash
cd backend
python ngrok.py
```

This will print a public URL that can be shared with anyone to access the app remotely.

---

## 🙏 Acknowledgements

- **Mrs. Manisha Aeri** — Project Guide, Department of CSE, Graphic Era Hill University
- [Ollama](https://ollama.com) — For making local LLM inference accessible
- [DeepSeek AI](https://deepseek.com) — For the DeepSeek-V3 model
- [OpenAI Whisper](https://github.com/openai/whisper) — For open-source speech recognition
- [Microsoft Edge TTS](https://github.com/rany2/edge-tts) — For high-quality neural text-to-speech
- [LangChain](https://langchain.com) — For LLM prompt orchestration

---

## 👥 Project Team

**Institution:** Graphic Era Hill University, Dehradun, Uttarakhand
**Department:** Computer Science & Engineering (B.Tech)
**Project Guide:** Mrs. Manisha Aeri
**Academic Year:** 2025-2026

---

## 📄 License

This project is submitted as part of the B.Tech degree requirements at Graphic Era Hill University. All rights reserved by the authors.
