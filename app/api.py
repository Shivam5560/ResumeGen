"""
Simple API script for resume generation
"""

import sys
import json
import os
import tempfile
from latex_generator import generate_resume


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "message": "Missing arguments"}))
        return
    
    action = sys.argv[1]
    data_json = sys.argv[2]
    
    try:
        data = json.loads(data_json)
        
        if action == 'generate_pdf':
            # Create temp file for PDF
            temp_file = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
            temp_file.close()
            
            result = generate_resume(data, temp_file.name)
            
            if result["success"]:
                result["pdf_path"] = temp_file.name
            else:
                # Clean up temp file if generation failed
                try:
                    os.unlink(temp_file.name)
                except:
                    pass
                    
        elif action == 'generate_latex':
            from latex_generator import LatexResumeGenerator
            generator = LatexResumeGenerator()
            latex_content = generator.generate_latex(data)
            result = {
                "success": True,
                "content": latex_content,
                "message": "LaTeX generated successfully"
            }
        else:
            result = {"success": False, "message": "Invalid action"}
            
        print(json.dumps(result, ensure_ascii=False))
    
    except Exception as e:
        print(json.dumps({"success": False, "message": f"Error: {str(e)}"}))


if __name__ == "__main__":
    main()
