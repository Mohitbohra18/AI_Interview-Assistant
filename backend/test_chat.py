import requests
import json

base_url = "http://127.0.0.1:8000/api"

print("--- UPLOADING ---")
files = {
    'resume': ('resume.pdf', b'mock resume content', 'application/pdf'),
    'job_description_file': ('job.pdf', b'mock job description', 'application/pdf')
}
data = {'role': 'developer', 'experience': 'mid'}
res = requests.post(f"{base_url}/upload", files=files, data=data)
print(res.status_code, res.json())
session_id = res.json().get("session_id")

answers = [
    "Hello, I am a software engineer.",
    "I know Python and React.",
    "My favorite project was an AI app."
]

for i, ans in enumerate(answers):
    print(f"\n--- CHAT LOOP {i+1} ---")
    payload = {"session_id": session_id, "user_answer": ans}
    res = requests.post(f"{base_url}/chat", json=payload)
    print(res.status_code)
    data = res.json()
    print("Phase:", data.get("phase"))
    print("Score:", data.get("score"))
    print("Feedback:", data.get("feedback"))
    print("AI Text:", data.get("ai_text")[:100], "...")
