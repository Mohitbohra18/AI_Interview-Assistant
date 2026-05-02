import requests

url = "http://127.0.0.1:8000/api/upload"

files = {
    'resume': ('resume.pdf', b'mock resume content', 'application/pdf'),
    'job_description_file': ('job.pdf', b'mock job description', 'application/pdf')
}

data = {
    'role': 'Software Engineer',
    'experience': 'mid'
}

response = requests.post(url, files=files, data=data)
print(response.status_code)
print(response.json())
