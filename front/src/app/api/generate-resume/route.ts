import { NextRequest, NextResponse } from 'next/server';

// Configure function timeout for Vercel
export const maxDuration = 30;
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('API route called - generate-resume');
  
  try {
    const { data, format = 'pdf' } = await request.json();

    console.log('Received request:', { format, dataKeys: Object.keys(data || {}) });

    if (!data) {
      console.error('No data provided');
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

    // Use environment variable for backend URL with multiple fallbacks
    const backendUrl = process.env.BACKEND_URL || 
                      process.env.NEXT_PUBLIC_BACKEND_URL || 
                      'https://resumegen-780f.onrender.com';
    
    console.log('Making request to:', `${backendUrl}/generate-resume`);
    console.log('Environment check:', {
      BACKEND_URL: process.env.BACKEND_URL,
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      NODE_ENV: process.env.NODE_ENV
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    
    try {
      const response = await fetch(`${backendUrl}/generate-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf, application/json',
          'User-Agent': 'ResumeGen-Frontend/1.0'
        },
        body: JSON.stringify(backendData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Backend response status:', response.status);
      console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        return NextResponse.json({ 
          error: `Backend error: ${response.status}`,
          details: errorText,
          backendUrl: backendUrl,
          timestamp: new Date().toISOString()
        }, { status: response.status });
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      // If it's a PDF, return the file stream
      if (format === 'pdf' || contentType?.includes('application/pdf')) {
        const pdfBuffer = await response.arrayBuffer();
        console.log('PDF buffer size:', pdfBuffer.byteLength);
        
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=resume.pdf',
            'Content-Length': pdfBuffer.byteLength.toString(),
          },
        });
      } else {
        // For other formats, return as text
        const content = await response.text();
        console.log('Text response length:', content.length);
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename=resume.tex',
          },
        });
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({ 
          error: 'Request timeout',
          details: 'Backend request took too long to respond',
          backendUrl: backendUrl
        }, { status: 408 });
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 });
  }
}

// Add GET method to test if route is accessible
export async function GET() {
  return NextResponse.json({ 
    message: 'Resume generation API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    backendUrl: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resumegen-780f.onrender.com'
  });
}
