import subprocess
import os
import shutil
from typing import Dict, Any, Optional
from utils.latex_template import LATEX_TEMPLATE


class ResumeService:
    """Service class for generating resumes from user data."""
    
    def __init__(self):
        self.template = LATEX_TEMPLATE
    
    def create_latex_content(self, data: Dict[str, Any]) -> str:
        """Populates the LaTeX template with user data."""
        content = self.template

        # Basic Info
        content = content.replace("{{NAME}}", data["name"])
        content = content.replace("{{EMAIL}}", data["email"])
        content = content.replace("{{LOCATION}}", data["location"])
        content = content.replace("{{LINKEDIN_URL}}", data["linkedin_url"])
        content = content.replace("{{GITHUB_URL}}", data["github_url"])

        # Experiences
        experience_tex_parts = []
        for exp in data["experiences"]:
            responsibilities_tex = "\n".join([f"        \\resumeItem{{{resp}}}" for resp in exp["responsibilities"]])
            experience_tex_parts.append(f"""    \\resumeSubheading
      {{{exp['title']}}}{{{exp['dates']}}}
      {{{exp['company']}}}{{{exp['location']}}}
      \\resumeItemListStart
{responsibilities_tex}
      \\resumeItemListEnd""")
        content = content.replace("{{EXPERIENCES_SECTION_CONTENT}}", "\n".join(experience_tex_parts))

        # Education
        education_tex_parts = []
        for edu in data["education"]:
            education_tex_parts.append(f"""    \\resumeSubheading
      {{{edu['institution']}}}{{{edu['graduation_date']}}}
      {{{edu['degree']}}}{{{edu['gpa']}}}""")
        content = content.replace("{{EDUCATION_SECTION_CONTENT}}", "\n".join(education_tex_parts))
        
        # Projects
        project_tex_parts = []
        for proj in data["projects"]:
            descriptions_tex = "\n".join([f"        \\resumeItem{{{desc}}}" for desc in proj["descriptions"]])
            project_tex_parts.append(f"""      \\resumeProjectHeading
      {{{{\\textbf{{{proj['title']}}}}}}}{{{proj.get('subtitle', '')}}}
      \\resumeItemListStart
{descriptions_tex}
      \\resumeItemListEnd""")
        content = content.replace("{{PROJECTS_SECTION_CONTENT}}", "\n".join(project_tex_parts))

        # Skills - Handle any skill categories dynamically
        skills_data = data["skills"]
        
        # Generate skills section dynamically based on available keys
        skills_items = []
        for skill_category, skill_values in skills_data.items():
            if skill_values:  # Only include non-empty skill categories
                # Format the category name (capitalize and replace underscores with spaces)
                formatted_category = skill_category.replace('_', ' ').title()
                skills_items.append(f"  \\item \\textbf{{{formatted_category}:}} {skill_values}")
        
        # Replace template placeholders with dynamic content
        skills_content = "\n".join(skills_items) if skills_items else "  \\item \\textbf{Skills:} Not specified"
        
        # Replace the skills section in template
        content = content.replace("{{SKILLS_SECTION_CONTENT}}", skills_content)
        
        return content

    def compile_to_pdf(self, latex_content: str, output_filename_base: str = "generated_resume") -> Dict[str, Any]:
        """Compiles the LaTeX content to a PDF file."""
        tex_file_path = f"{output_filename_base}.tex"
        pdf_file_path = f"{output_filename_base}.pdf"

        pdflatex_cmd = shutil.which("pdflatex")
        if not pdflatex_cmd:
            return {
                "success": False,
                "message": "pdflatex command not found. Please install a LaTeX distribution.",
                "pdf_path": None
            }

        try:
            # Write the LaTeX content to file
            with open(tex_file_path, "w", encoding="utf-8") as f:
                f.write(latex_content)

            # Run pdflatex twice to resolve cross-references
            for i in range(2):
                process = subprocess.run(
                    [pdflatex_cmd, "-interaction=nonstopmode", tex_file_path],
                    capture_output=True, text=True, check=False
                )
                
                if process.returncode != 0 and i == 1:  # Only warn on final pass
                    print(f"Warning: LaTeX compilation had errors, but may have still produced a PDF.")
            
            if os.path.exists(pdf_file_path):
                return {
                    "success": True,
                    "message": f"PDF generated successfully: {os.path.abspath(pdf_file_path)}",
                    "pdf_path": os.path.abspath(pdf_file_path)
                }
            else:
                return {
                    "success": False,
                    "message": f"PDF file {pdf_file_path} was not created.",
                    "pdf_path": None
                }

        except Exception as e:
            return {
                "success": False,
                "message": f"An unexpected error occurred: {e}",
                "pdf_path": None
            }

    def generate_resume(self, user_data: Dict[str, Any], output_filename: str = "generated_resume") -> Dict[str, Any]:
        """Main method to generate a complete resume from user data."""
        try:
            # Generate LaTeX content
            latex_content = self.create_latex_content(user_data)
            
            # Compile to PDF
            result = self.compile_to_pdf(latex_content, output_filename)
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Resume generation failed: {e}",
                "pdf_path": None
            }
