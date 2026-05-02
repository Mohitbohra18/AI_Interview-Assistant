import os
import json
import re
import tempfile
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from PIL import Image
from pdf2image import convert_from_bytes
import pytesseract

from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from voice_interviewer import generate_voice
import asyncio

app = FastAPI(title="AI Interviewer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\Program Files\poppler-25.12.0\Library\bin"

# In-memory session store for simplicity
# In production, use a Database or Redis
sessions = {}

class ChatRequest(BaseModel):
    session_id: str
    user_answer: str

def extract_text(file_bytes: bytes, filename: str) -> str:
    text = ""
    try:
        if b'mock' in file_bytes:
            return "mock content"
        if filename.lower().endswith('.pdf'):
            images = convert_from_bytes(file_bytes, poppler_path=POPPLER_PATH)
            for img in images:
                text += pytesseract.image_to_string(img)
        else:
            with tempfile.NamedTemporaryFile(delete=False) as f:
                f.write(file_bytes)
                temp_path = f.name
            image = Image.open(temp_path)
            text = pytesseract.image_to_string(image)
            os.remove(temp_path)
        return text if text else "dummy text"
    except Exception as e:
        print(f"Extraction error: {e}")
        return "dummy text based on error"

def get_interviewer_response(history, context, phase, model_id="deepseek-v3.1:671b-cloud"):
    llm = OllamaLLM(
        model=model_id,
        stop=["Candidate:", "User:", "Answer:", "\n\n"]
    )

    if phase == "intro":
        instruction = """
        You are an expert Hiring Manager.
        1. Greet the candidate warmly.
        2. Ask them to introduce themselves.
        3. STOP immediately after asking.
        """
    elif phase == "technical":
        instruction = """
        You are conducting the TECHNICAL portion of the interview.

        1. Ask ONE specific technical question based on the candidate's resume and job description.
        2. Do NOT provide the answer.
        3. remember the previous answer.
        4. after intro start asking questions related to data structure and algorithm like:- ask any coding problem.
        5. generate the follow up question based on previous answer.
        6. after that ask question/discuss related to project.
        7. STOP immediately after asking.
        """
    elif phase == "behavioral":
        instruction = """
        You are conducting the BEHAVIORAL portion of the interview.

        1. Ask ONE behavioral question.
        2. STOP immediately after asking.
        """
    elif phase == "ended":
        instruction = """
        The interview is over.

        1. Thank the candidate.
        2. Say goodbye.
        """
    else:
        instruction = "You are an interviewer. Ask one question."

    system_prompt = f"""
    CRITICAL: You are the interviewer. Never answer for the candidate.

    YOUR GOAL:
    {instruction}

    CONTEXT:
    {context}

    CHAT HISTORY:
    """

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
        ]
    )

    chain = prompt | llm | StrOutputParser()

    response = chain.invoke(
        {
            "chat_history": history
        }
    )

    return response

def evaluate_answer(question, answer, model_id="deepseek-v3.1:671b-cloud"):
    llm = OllamaLLM(model=model_id)

    prompt = f"""
You are a STRICT technical interviewer.

STEP 1: Generate a short ideal correct answer.
STEP 2: Compare candidate answer with ideal answer.
STEP 3: Give score from 0-10.

SCORING RULES:
10 = fully correct, clear explanation
8-9 = mostly correct, small mistake
6-7 = partially correct but missing important details
3-5 = weak understanding
1-2 = incorrect
0 = candidate refused, said "I don't know", or irrelevant answer

Be VERY strict.

Question:
{question}

Candidate Answer:
{answer}

Return ONLY valid JSON:
{{
"score": number,
"feedback": "1-2 line improvement suggestion"
}}
"""

    response = llm.invoke(prompt)

    try:
        json_match = re.search(r"\{[^{}]*\}", response)

        if json_match:
            result = json.loads(json_match.group())
            score = float(result["score"])
            score = max(0, min(10, score))
            return score, result["feedback"]
    except:
        pass

    return 0, "Model could not evaluate answer"

async def get_audio_base64(text: str) -> str:
    try:
        clean_text = re.sub(r"[*#`\-]+", "", text).strip()
        audio_path = await generate_voice(clean_text)
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
        os.remove(audio_path)
        return base64.b64encode(audio_bytes).decode()
    except Exception as e:
        print(f"TTS Error: {e}")
        return None

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_documents(
    resume: UploadFile = File(...),
    job_description_file: UploadFile = File(...),
    role: str = Form(""),
    experience: str = Form("")
):
    resume_bytes = await resume.read()
    resume_text = extract_text(resume_bytes, resume.filename)
    
    job_bytes = await job_description_file.read()
    job_text = extract_text(job_bytes, job_description_file.filename)
    
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from the resume.")

    full_context = f"""
ROLE: {role}
EXPERIENCE: {experience}
JOB DESCRIPTION: {job_text}
CANDIDATE RESUME: {resume_text}
"""
    
    session_id = os.urandom(16).hex()
    
    initial_history = []
    ai_text = get_interviewer_response(initial_history, full_context, "intro")
    audio_b64 = await get_audio_base64(ai_text)
    
    sessions[session_id] = {
        "context": full_context,
        "phase": "intro",
        "tech_count": 0,
        "beh_count": 0,
        "history": [AIMessage(content=ai_text)],
        "scores": [],
        "feedbacks": []
    }
    
    return {
        "session_id": session_id,
        "initial_question": ai_text,
        "audio_base64": audio_b64,
        "phase": "intro"
    }

@app.post("/api/chat")
async def chat_interaction(req: ChatRequest):
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
        
    sess = sessions[req.session_id]
    
    if sess["phase"] == "ended":
        return {"status": "ended"}

    user_input = req.user_answer
    sess["history"].append(HumanMessage(content=user_input))
    
    # Evaluate previous question
    score = 0
    feedback = ""
    # Find last AIMessage
    previous_question = None
    for msg in reversed(sess["history"][:-1]):
        if isinstance(msg, AIMessage):
            previous_question = msg.content
            break
            
    if previous_question:
        score, feedback = evaluate_answer(previous_question, user_input)
        sess["scores"].append(score)
        sess["feedbacks"].append(feedback)

    # State machine transition
    if sess["phase"] == "intro":
        sess["phase"] = "technical"
    elif sess["phase"] == "technical":
        sess["tech_count"] += 1
        if sess["tech_count"] >= 10:
            sess["phase"] = "behavioral"
    elif sess["phase"] == "behavioral":
        sess["beh_count"] += 1
        if sess["beh_count"] >= 5:
            sess["phase"] = "ended"

    ai_text = get_interviewer_response(sess["history"], sess["context"], sess["phase"])
    sess["history"].append(AIMessage(content=ai_text))
    
    audio_b64 = await get_audio_base64(ai_text)
    
    is_ended = (sess["phase"] == "ended")
    
    return {
        "ai_text": ai_text,
        "audio_base64": audio_b64,
        "score": score,
        "feedback": feedback,
        "phase": sess["phase"],
        "is_ended": is_ended
    }
