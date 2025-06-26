import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { data, format } = await request.json();
    
    console.log('Frontend data received:', JSON.stringify(data, null, 2));
    
    // Transform frontend data structure to match backend expectations
    const backendData = {
      name: data.personal?.name || data.name || '',
      email: data.personal?.email || data.email || '',
      location: data.personal?.location || data.location || '',
      linkedin_url: data.personal?.linkedin || data.linkedin_url || data.linkedin || '',
      github_url: data.personal?.github || data.github_url || data.github || '',
      experiences: (data.experience || data.experiences || []).map((exp: any) => ({
        title: exp.title || exp.position || '',
        company: exp.company || exp.organization || '',
        location: exp.location || '',
        dates: exp.duration || exp.dates || exp.period || '',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : 
                         exp.responsibilities ? [exp.responsibilities] : 
                         Array.isArray(exp.description) ? exp.description : 
                         exp.description ? [exp.description] : []
      })),
      education: (data.education || []).map((edu: any) => ({
        institution: edu.school || edu.institution || edu.university || '',
        degree: edu.degree || edu.program || '',
        graduation_date: edu.graduationDate || edu.graduation_date || edu.date || '',
        gpa: edu.gpa || edu.cgpa || ''
      })),
      projects: (data.projects || []).map((proj: any) => ({
        title: proj.name || proj.title || '',
        subtitle: proj.technologies || proj.tech || proj.subtitle || '',
        descriptions: Array.isArray(proj.description) ? proj.description :
                     proj.description ? [proj.description] :
                     Array.isArray(proj.descriptions) ? proj.descriptions : []
      })),
      skills: data.skills || {}
    };

    console.log('Backend data transformed:', JSON.stringify(backendData, null, 2));

    // Determine action based on format
    const action = format === 'pdf' ? 'generate_pdf' : 'generate_latex';
    
    // Call Python backend
    const pythonScriptPath = path.join(process.cwd(), '..', 'app', 'api.py');
    const result = await callPythonBackend(pythonScriptPath, action, backendData);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    if (format === 'pdf') {
      // Serve PDF file
      const pdfPath = result.pdf_path;
      if (!fs.existsSync(pdfPath)) {
        return NextResponse.json({ error: 'PDF file not found' }, { status: 404 });
      }
      
      const pdfBuffer = fs.readFileSync(pdfPath);
      
      // Clean up only the PDF file (other temp files are managed by Python's tempfile)
      try {
        fs.unlinkSync(pdfPath);
      } catch (cleanupError) {
        console.warn('Error cleaning up PDF file:', cleanupError);
      }
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=resume.pdf',
        },
      });
    } else {
      // Serve LaTeX content
      return new NextResponse(result.content, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename=resume.tex',
        },
      });
    }

  } catch (error) {
    console.error('Error in generate-resume API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function callPythonBackend(scriptPath: string, action: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath, action, JSON.stringify(data)]);
    
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      // Log stderr for debugging
      if (stderr) {
        console.log('Python stderr:', stderr);
      }
      
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }
      
      try {
        // Clean stdout by removing any non-JSON lines
        const lines = stdout.trim().split('\n');
        const jsonLine = lines.find(line => line.trim().startsWith('{') && line.trim().endsWith('}'));
        
        if (!jsonLine) {
          reject(new Error(`No valid JSON found in Python output: ${stdout}`));
          return;
        }
        
        const result = JSON.parse(jsonLine);
        resolve(result);
      } catch (parseError) {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}
