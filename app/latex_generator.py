"""
Simple LaTeX Resume Generator
Generates LaTeX content that matches the working sample.tex format exactly
"""

import os
import subprocess
import tempfile
import shutil
import re
import sys
from typing import Dict, Any, List, Union


class LatexResumeGenerator:
    """Generates LaTeX resumes matching the sample.tex format"""
    
    def __init__(self):
        self.template = self._get_template()
    
    def _escape_latex(self, text: Union[str, List]) -> str:
        """Simple LaTeX escaping for normal user input"""
        # Handle case where text might be a list (fix for the original error)
        if isinstance(text, list):
            text = ', '.join(str(item) for item in text)
        elif not isinstance(text, str):
            text = str(text) if text is not None else ""
        
        if not text:
            return ""
        
        # Simple character escaping for normal text - order matters!
        escaped_text = text
        
        # Handle backslashes first to avoid double escaping
        escaped_text = escaped_text.replace('\\', r'\textbackslash{}')
        
        # Then handle other special characters
        latex_special_chars = {
            '{': r'\{',
            '}': r'\}',
            '&': r'\&',
            '%': r'\%', 
            '$': r'\$',
            '#': r'\#',
            '^': r'\textasciicircum{}',
            '_': r'\_',
            '~': r'\textasciitilde{}'
        }
        
        for char, escape in latex_special_chars.items():
            escaped_text = escaped_text.replace(char, escape)
        
        return escaped_text
    
    def _get_template(self) -> str:
        """Returns the LaTeX template matching sample.tex exactly"""
        return r"""
%-------------------------
% Resume in Latex
% Author : Shivam Sourav (adapted from Jake Gutierrez's template)
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[margin=1in]{geometry}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\input{glyphtounicode}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1.2in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.5in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item \small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small#4} \\
    \end{tabular*}\vspace{-5pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-5pt}
}


\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}




%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{document}

%----------HEADING----------
\begin{center}
    \textbf{\Huge \scshape {{NAME}}} \\ \vspace{1pt}
     {{CONTACT}}
\end{center}


%-----------EXPERIENCE-----------
\section{Professional Experience}
  \resumeSubHeadingListStart
{{EXPERIENCE}}
  \resumeSubHeadingListEnd

%-----------EDUCATION-----------
\section{Education}
  \resumeSubHeadingListStart
{{EDUCATION}}
  \resumeSubHeadingListEnd
%-----------PROJECTS-----------
\section{University Projects}
  \resumeSubHeadingListStart
{{PROJECTS}}
  \resumeSubHeadingListEnd

     \section{Additional}
\begin{itemize}
{{SKILLS}}
\end{itemize}




\end{document}
"""

    def generate_latex(self, data: Dict[str, Any]) -> str:
        """Generate LaTeX content from data"""
        # Add debugging to see what data we receive
        print("=== DEBUG: Received data ===", file=sys.stderr)
        print(f"Raw data keys: {list(data.keys())}", file=sys.stderr)
        print(f"Full data: {data}", file=sys.stderr)
        print("=== END DEBUG ===", file=sys.stderr)
        
        content = self.template
        
        # Replace placeholders with escaped content
        content = content.replace("{{NAME}}", self._escape_latex(data.get("name", "")))
        content = content.replace("{{CONTACT}}", self._build_contact(data))
        content = content.replace("{{EXPERIENCE}}", self._build_experience(data.get("experiences", [])))
        content = content.replace("{{EDUCATION}}", self._build_education(data.get("education", [])))
        content = content.replace("{{PROJECTS}}", self._build_projects(data.get("projects", [])))
        content = content.replace("{{SKILLS}}", self._build_skills(data.get("skills", {})))
        
        return content
    
    def _build_contact(self, data: Dict[str, Any]) -> str:
        """Build contact section exactly like sample.tex"""
        email = self._escape_latex(data.get("email", ""))
        location = self._escape_latex(data.get("location", ""))
        linkedin_url = data.get("linkedin_url", "")
        github_url = data.get("github_url", "")
        
        print(f"DEBUG Contact - Email: '{email}', Location: '{location}', LinkedIn: '{linkedin_url}', GitHub: '{github_url}'", file=sys.stderr)
        
        contact_parts = []
        
        # Email and location on first line
        if email:
            contact_parts.append(f"\\href{{mailto:{email}}}{{\\underline{{{email}}}}}")
        if location:
            contact_parts.append(location)
        
        first_line = " $|$ ".join(contact_parts)
        
        # LinkedIn and GitHub on second line
        second_line_parts = []
        if linkedin_url:
            clean_url = linkedin_url.replace("https://", "").replace("http://", "").replace("www.", "")
            second_line_parts.append(f"\\href{{{linkedin_url}}}{{\\underline{{{clean_url}}}}}")
        
        if github_url:
            clean_url = github_url.replace("https://", "").replace("http://", "")
            second_line_parts.append(f"\\href{{{github_url}}}{{\\underline{{{clean_url}}}}}")
        
        if second_line_parts:
            second_line = " $|$\n    ".join(second_line_parts)
            result = f"{first_line} \\\\ {second_line}"
        else:
            result = first_line
            
        print(f"DEBUG Contact result: '{result}'", file=sys.stderr)
        return result
    
    def _build_experience(self, experiences: List[Dict[str, Any]]) -> str:
        """Build experience section with simple escaping only"""
        print(f"DEBUG Experience - Processing {len(experiences)} experiences", file=sys.stderr)
        
        if not experiences:
            print("DEBUG Experience - No experiences found", file=sys.stderr)
            return ""
        
        sections = []
        for i, exp in enumerate(experiences):
            print(f"DEBUG Experience {i}: {exp}", file=sys.stderr)
            
            title = self._escape_latex(exp.get("title", ""))
            dates = self._escape_latex(exp.get("dates", ""))
            company = self._escape_latex(exp.get("company", ""))
            location = self._escape_latex(exp.get("location", ""))
            
            section = f"""    \\resumeSubheading
      {{{title}}}{{{dates}}}
      {{{company}}}{{{location}}}
      \\resumeItemListStart"""
            
            # Add responsibilities with simple escaping only
            responsibilities = exp.get("responsibilities", [])
            print(f"DEBUG Responsibilities for exp {i}: {responsibilities}", file=sys.stderr)
            
            for j, resp in enumerate(responsibilities):
                # Handle both string and list inputs
                if isinstance(resp, list):
                    resp = ', '.join(str(item) for item in resp)
                elif not isinstance(resp, str):
                    resp = str(resp) if resp is not None else ""
                
                if resp and resp.strip():  # Only add non-empty responsibilities
                    escaped_resp = self._escape_latex(resp.strip())
                    section += f"\n        \\resumeItem{{{escaped_resp}}}"
                    print(f"DEBUG Added responsibility {j}: {escaped_resp[:50]}...", file=sys.stderr)
            
            section += "\n      \\resumeItemListEnd"
            sections.append(section)
        
        result = "\n".join(sections)
        print(f"DEBUG Experience result length: {len(result)}", file=sys.stderr)
        return result
    
    def _build_projects(self, projects: List[Dict[str, Any]]) -> str:
        """Build projects section with simple escaping only"""
        print(f"DEBUG Projects - Processing {len(projects)} projects", file=sys.stderr)
        
        if not projects:
            print("DEBUG Projects - No projects found", file=sys.stderr)
            return ""
        
        sections = []
        for i, proj in enumerate(projects):
            print(f"DEBUG Project {i}: {proj}", file=sys.stderr)
            
            title = self._escape_latex(proj.get("title", ""))
            
            section = f"""      \\resumeProjectHeading
        {{\\textbf{{{title}}}}}{{}}
      \\resumeItemListStart"""
            
            # Add descriptions with simple escaping only
            descriptions = proj.get("descriptions", [])
            print(f"DEBUG Descriptions for project {i}: {descriptions}", file=sys.stderr)
            
            for j, desc in enumerate(descriptions):
                # Handle both string and list inputs
                if isinstance(desc, list):
                    desc = ', '.join(str(item) for item in desc)
                elif not isinstance(desc, str):
                    desc = str(desc) if desc is not None else ""
                
                if desc and desc.strip():  # Only add non-empty descriptions
                    escaped_desc = self._escape_latex(desc.strip())
                    section += f"\n        \\resumeItem{{{escaped_desc}}}"
                    print(f"DEBUG Added description {j}: {escaped_desc[:50]}...", file=sys.stderr)
            
            section += "\n      \\resumeItemListEnd"
            sections.append(section)
        
        result = "\n".join(sections)
        print(f"DEBUG Projects result length: {len(result)}", file=sys.stderr)
        return result
    
    def _build_education(self, education: List[Dict[str, Any]]) -> str:
        """Build education section exactly like sample.tex"""
        print(f"DEBUG Education - Processing {len(education)} education entries", file=sys.stderr)
        
        if not education:
            print("DEBUG Education - No education found", file=sys.stderr)
            return ""
        
        sections = []
        for i, edu in enumerate(education):
            print(f"DEBUG Education {i}: {edu}", file=sys.stderr)
            
            institution = self._escape_latex(edu.get("institution", ""))
            date = self._escape_latex(edu.get("graduation_date", ""))
            degree = self._escape_latex(edu.get("degree", ""))
            gpa = self._escape_latex(edu.get("gpa", ""))
            
            sections.append(f"""    \\resumeSubheading
      {{{institution}}}{{{date}}}
      {{{degree}}}{{{gpa}}}""")
        
        result = "\n".join(sections)
        print(f"DEBUG Education result length: {len(result)}", file=sys.stderr)
        return result
    
    def _build_skills(self, skills: Dict[str, Any]) -> str:
        """Build skills section with simple escaping - handles both strings and lists"""
        print(f"DEBUG Skills - Processing skills: {skills}", file=sys.stderr)
        
        if not skills:
            print("DEBUG Skills - No skills found", file=sys.stderr)
            return ""
        
        # Improved skill name mapping to handle various formats
        skill_names = {
            "languages": "Languages",
            "language": "Languages", 
            "programming_languages": "Programming Languages",
            "tools": "Tools",
            "tool": "Tools",
            "technologies": "Technologies",
            "technology": "Technologies",
            "frameworks": "Frameworks",
            "framework": "Frameworks",
            "libraries": "Libraries",
            "library": "Libraries",
            "frameworks_libraries": "Frameworks \\& Libraries",
            "frameworks_&_libraries": "Frameworks \\& Libraries",
            "data_visualization": "Data \\& Visualization",
            "data_&_visualization": "Data \\& Visualization",
            "databases": "Databases",
            "database": "Databases",
            "concepts": "Concepts",
            "soft_skills": "Soft Skills",
            "concepts_soft_skills": "Concepts \\& Soft Skills",
            "operating_systems": "Operating Systems",
            "os": "Operating Systems"
        }
        
        items = []
        for key, value in skills.items():
            print(f"DEBUG Skill category '{key}': '{value}'", file=sys.stderr)
            if value and str(value).strip():  # Check for non-empty values
                # Clean up the key and get proper name
                clean_key = key.lower().replace(" ", "_").replace("-", "_")
                name = skill_names.get(clean_key, key.replace("_", " ").replace("-", " ").title())
                
                # Handle both strings and lists properly
                escaped_value = self._escape_latex(value)
                items.append(f"  \\item \\textbf{{{name}:}} {escaped_value}")
                print(f"DEBUG Added skill item: {name}", file=sys.stderr)
        
        result = "\n".join(items)
        print(f"DEBUG Skills result: '{result}'", file=sys.stderr)
        return result
    
    def compile_to_pdf(self, latex_content: str, output_path: str) -> Dict[str, Any]:
        """Compile LaTeX to PDF"""
        # Create temp directory
        with tempfile.TemporaryDirectory() as temp_dir:
            tex_file = os.path.join(temp_dir, "resume.tex")
            pdf_file = os.path.join(temp_dir, "resume.pdf")
            
            # Write LaTeX file
            with open(tex_file, "w", encoding="utf-8") as f:
                f.write(latex_content)
            
            # Compile with pdflatex
            try:
                # Run twice for references
                for _ in range(2):
                    result = subprocess.run(
                        ["pdflatex", "-interaction=nonstopmode", "-output-directory", temp_dir, tex_file],
                        capture_output=True,
                        text=True
                    )
                
                # Check if PDF was created
                if os.path.exists(pdf_file):
                    # Copy to final location
                    shutil.copy2(pdf_file, output_path)
                    return {
                        "success": True,
                        "message": "PDF generated successfully",
                        "pdf_path": output_path
                    }
                else:
                    return {
                        "success": False,
                        "message": f"PDF compilation failed: {result.stdout}",
                        "pdf_path": None
                    }
                    
            except Exception as e:
                return {
                    "success": False,
                    "message": f"Error: {str(e)}",
                    "pdf_path": None
                }


def generate_resume(data: Dict[str, Any], output_filename: str = "resume.pdf") -> Dict[str, Any]:
    """Main function to generate resume"""
    generator = LatexResumeGenerator()
    
    # Generate LaTeX
    latex_content = generator.generate_latex(data)
    
    # Compile to PDF
    return generator.compile_to_pdf(latex_content, output_filename)

