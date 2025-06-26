from typing import Dict, Any
from services.resume_service import ResumeService


class ResumeController:
    """Controller class for handling resume generation requests."""
    
    def __init__(self):
        self.resume_service = ResumeService()
    
    def generate_resume(self, user_data: Dict[str, Any], output_filename: str = "generated_resume") -> Dict[str, Any]:
        """
        Generate a resume PDF from user data.
        
        Args:
            user_data: Dictionary containing user information
            output_filename: Base name for output files (without extension)
            
        Returns:
            Dictionary with success status, message, and PDF path
        """
        # Validate required fields
        required_fields = ["name", "email", "location", "linkedin_url", "github_url", 
                          "experiences", "education", "projects", "skills"]
        
        missing_fields = [field for field in required_fields if field not in user_data]
        if missing_fields:
            return {
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}",
                "pdf_path": None
            }
        
        # Generate resume using service
        result = self.resume_service.generate_resume(user_data, output_filename)
        
        return result
    
    def validate_user_data(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate user data structure and content.
        
        Args:
            user_data: Dictionary containing user information
            
        Returns:
            Dictionary with validation status and messages
        """
        validation_errors = []
        
        # Check required top-level fields
        required_fields = ["name", "email", "location", "linkedin_url", "github_url", 
                          "experiences", "education", "projects", "skills"]
        
        for field in required_fields:
            if field not in user_data:
                validation_errors.append(f"Missing field: {field}")
        
        # Validate experiences structure
        if "experiences" in user_data:
            for i, exp in enumerate(user_data["experiences"]):
                exp_required = ["title", "dates", "company", "location", "responsibilities"]
                for field in exp_required:
                    if field not in exp:
                        validation_errors.append(f"Experience {i+1} missing field: {field}")
        
        # Validate education structure
        if "education" in user_data:
            for i, edu in enumerate(user_data["education"]):
                edu_required = ["institution", "graduation_date", "degree", "gpa"]
                for field in edu_required:
                    if field not in edu:
                        validation_errors.append(f"Education {i+1} missing field: {field}")
        
        # Validate projects structure
        if "projects" in user_data:
            for i, proj in enumerate(user_data["projects"]):
                proj_required = ["title", "descriptions"]
                for field in proj_required:
                    if field not in proj:
                        validation_errors.append(f"Project {i+1} missing field: {field}")
        
        # Validate skills structure
        if "skills" in user_data:
            skills_required = ["languages_tools", "frameworks_libraries", 
                             "data_visualization", "concepts_soft_skills"]
            for field in skills_required:
                if field not in user_data["skills"]:
                    validation_errors.append(f"Skills missing field: {field}")
        
        return {
            "valid": len(validation_errors) == 0,
            "errors": validation_errors
        }
