import { NextRequest, NextResponse } from 'next/server';

// Configure function timeout for Vercel
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { data, format = 'pdf' } = await request.json();

    console.log('Received request:', { format, dataKeys: Object.keys(data || {}) });

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Transform data to match backend expectations
    const backendData = {
      name: data.personal?.name || '',
      email: data.personal?.email || '',
      location: data.personal?.location || '',
      linkedin_url: data.personal?.linkedin || '',
      github_url: data.personal?.github || '',
      experiences: (data.experience || []).map((exp: Record<string, any>) => ({
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        dates: exp.dates || '',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
      })),
      education: (data.education || []).map((edu: Record<string, any>) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        graduation_date: edu.graduationDate || '',
        gpa: edu.gpa || ''
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

    // Use environment variable for backend URL with fallback
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resumegen-780f.onrender.com';
    
    console.log('Making request to:', `${backendUrl}/generate-resume`);
    
    const response = await fetch(`${backendUrl}/generate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf, application/json',
      },
      body: JSON.stringify(backendData),
      // Add timeout for Vercel
      signal: AbortSignal.timeout(25000) // 25 seconds
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      return NextResponse.json({ 
        error: `Backend error: ${response.status}`,
        details: errorText,
        backendUrl: backendUrl
      }, { status: response.status });
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
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
