from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import tempfile
import json
from typing import Dict, Any, List, Optional
from latex_generator import generate_resume

app = FastAPI(title="Resume Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your Vercel domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactInfo(BaseModel):
    email: str
    location: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    github_url: Optional[str] = ""

class Experience(BaseModel):
    title: str
    company: str
    location: str
    dates: str
    responsibilities: List[str]

class Education(BaseModel):
    institution: str
    degree: str
    graduation_date: str
    gpa: Optional[str] = ""

class Project(BaseModel):
    title: str
    descriptions: List[str]

class ResumeData(BaseModel):
    name: str
    email: str
    location: Optional[str] = ""
    linkedin_url: Optional[str] = ""
    github_url: Optional[str] = ""
    experiences: List[Experience] = []
    education: List[Education] = []
    projects: List[Project] = []
    skills: Dict[str, Any] = {}

@app.get("/")
def read_root():
    return {"message": "Resume Generator Backend API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/generate-resume")
async def generate_resume_endpoint(data: ResumeData):
    try:
        # Convert Pydantic model to dict
        resume_data = data.dict()
        
        # Generate PDF using your existing LaTeX generator
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_file:
            result = generate_resume(resume_data, tmp_file.name)
            
            if result["success"]:
                return FileResponse(
                    path=tmp_file.name,
                    filename="resume.pdf",
                    media_type="application/pdf"
                )
            else:
                raise HTTPException(status_code=500, detail=result["message"])
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
