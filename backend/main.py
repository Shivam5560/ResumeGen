from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import tempfile
import subprocess
import json
from typing import Dict, Any, List, Optional
from latex_generator import generate_resume
import uvicorn

app = FastAPI(title="Resume Generator API")

# Configure CORS for Vercel frontend
origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:5173",  # Vite dev server
    "https://*.vercel.app",   # All Vercel deployments
    "https://resume-gen-iota.vercel.app/",  # Replace with your actual Vercel URL
]

# If Railway environment, allow all origins (more permissive for deployment)
if os.getenv("RAILWAY_ENVIRONMENT"):
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    # Check if LaTeX is available
    try:
        result = subprocess.run(['pdflatex', '--version'], 
                              capture_output=True, text=True, timeout=5)
        latex_available = result.returncode == 0
    except:
        latex_available = False
    
    return {
        "status": "healthy",
        "latex_available": latex_available,
        "environment": os.environ.get("RAILWAY_ENVIRONMENT", "local"),
        "alternative_available": True  # We have fallback options
    }

@app.post("/generate-resume")
async def generate_resume_endpoint(data: ResumeData):
    try:
        resume_data = data.dict()
        
        # Try LaTeX first, fall back to alternative if needed
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp_file:
            try:
                result = generate_resume(resume_data, tmp_file.name)
                
                if result["success"]:
                    return FileResponse(
                        path=tmp_file.name,
                        filename="resume.pdf",
                        media_type="application/pdf"
                    )
                else:
                    # Fallback: return LaTeX source or error message
                    raise HTTPException(
                        status_code=503, 
                        detail="PDF generation temporarily unavailable. LaTeX not installed on server."
                    )
            except Exception as latex_error:
                # Return helpful error message
                raise HTTPException(
                    status_code=503,
                    detail=f"Resume generation service temporarily unavailable: {str(latex_error)}"
                )
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating resume: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
