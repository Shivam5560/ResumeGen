#!/usr/bin/env python3
import sys
import json
import os
import base64
from pathlib import Path

# Add the app directory to Python path
app_dir = Path(__file__).parent
sys.path.insert(0, str(app_dir))

from controllers.resume_generator import ResumeController

def main():
    try:
        # Read JSON data from stdin
        input_data = sys.stdin.read()
        request_data = json.loads(input_data)
        
        data = request_data.get('data', {})
        format_type = request_data.get('format', 'pdf')
        
        controller = ResumeController()
        
        if format_type == 'pdf':
            # Generate PDF
            output_filename = f"resume_{os.getpid()}"
            result = controller.generate_resume(data, output_filename)
            
            if result['success']:
                # Read the generated PDF file and encode as base64
                pdf_path = result['pdf_path']
                with open(pdf_path, 'rb') as pdf_file:
                    pdf_content = pdf_file.read()
                    pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
                
                # Clean up the temporary file
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)
                
                response = {
                    "success": True,
                    "content": pdf_base64,
                    "message": "PDF generated successfully"
                }
            else:
                response = {
                    "error": result.get('message', 'Failed to generate PDF')
                }
                
        elif format_type == 'latex':
            # Generate LaTeX content only
            latex_content = controller.resume_service.create_latex_content(data)
            response = {
                "success": True,
                "content": latex_content,
                "message": "LaTeX generated successfully"
            }
        else:
            response = {
                "error": "Invalid format type"
            }
            
        print(json.dumps(response))
    
    except Exception as e:
        error_response = {
            "error": f"Error processing request: {str(e)}"
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()
