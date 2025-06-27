import { NextRequest, NextResponse } from 'next/server';

// Configure function timeout for Vercel
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { data, format }: { data: Record<string, any>; format: string } = await request.json();
    
    console.log('Frontend data received:', JSON.stringify(data, null, 2));
    
    const validateData = (data: Record<string, any>): { isValid: boolean; error?: string } => {
      return { isValid: true };
    };

    const validationResult = validateData(data);
    if (!validationResult.isValid) {
      return NextResponse.json({ error: validationResult.error || 'Invalid data' }, { status: 400 });
    }

    const backendData = {
      name: data.personal?.name || data.name || '',
      email: data.personal?.email || data.email || '',
      location: data.personal?.location || data.location || '',
      linkedin_url: data.personal?.linkedin || data.linkedin_url || data.linkedin || '',
      github_url: data.personal?.github || data.github_url || data.github || '',
      experiences: (data.experience || data.experiences || []).map((exp: Record<string, any>) => ({
        title: exp.title || exp.position || '',
        company: exp.company || exp.organization || '',
        location: exp.location || '',
        dates: exp.duration || exp.dates || exp.period || '',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : 
                         exp.responsibilities ? [exp.responsibilities] : 
                         Array.isArray(exp.description) ? exp.description : 
                         exp.description ? [exp.description] : []
      })),
      education: (data.education || []).map((edu: Record<string, any>) => ({
        institution: edu.school || edu.institution || edu.university || '',
        degree: edu.degree || edu.program || '',
        graduation_date: edu.graduationDate || edu.graduation_date || edu.date || '',
        gpa: edu.gpa || edu.cgpa || ''
      })),
      projects: (data.projects || []).map((proj: Record<string, any>) => ({
        title: proj.name || proj.title || '',
        descriptions: Array.isArray(proj.description) ? proj.description :
                     proj.description ? [proj.description] :
                     Array.isArray(proj.descriptions) ? proj.descriptions : []
      })),
      skills: data.skills || {}
    };

    console.log('Backend data transformed:', JSON.stringify(backendData, null, 2));

    // Make API call to FastAPI backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/generate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return NextResponse.json({ error: errorData.detail || 'Backend error' }, { status: response.status });
    }

    // If it's a PDF, return the file stream
    if (format === 'pdf' || response.headers.get('content-type') === 'application/pdf') {
      const pdfBuffer = await response.arrayBuffer();
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=resume.pdf',
        },
      });
    } else {
      // For other formats, return as text
      const content = await response.text();
      return new NextResponse(content, {
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
