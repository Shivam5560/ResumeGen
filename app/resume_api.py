import sys
import json
import os
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

from controllers.resume_generator import ResumeController

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "message": "Missing arguments"}))
        return
    
    action = sys.argv[1]
    data_json = sys.argv[2]
    
    try:
        data = json.loads(data_json)
        controller = ResumeController()
        
        if action == 'generate_pdf':
            # Generate a unique filename
            output_filename = f"resume_{os.getpid()}"
            result = controller.generate_resume(data, output_filename)
        elif action == 'generate_latex':
            # Generate LaTeX content only
            latex_content = controller.resume_service.create_latex_content(data)
            result = {
                "success": True,
                "content": latex_content,
                "message": "LaTeX generated successfully"
            }
        else:
            result = {"success": False, "message": "Invalid action"}
            
        print(json.dumps(result))
    
    except Exception as e:
        print(json.dumps({"success": False, "message": str(e)}))

if __name__ == "__main__":
    main()
