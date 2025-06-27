import { NextApiRequest, NextApiResponse } from 'next';

// Configure function timeout for Vercel
export const config = {
  maxDuration: 30,
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'Resume generation API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      backendUrl: process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resumegen-780f.onrender.com'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API route called - generate-resume');
  
  try {
    const { data, format = 'pdf' } = req.body;

    console.log('Received request:', { format, dataKeys: Object.keys(data || {}) });

    if (!data) {
      console.error('No data provided');
      return res.status(400).json({ error: 'No data provided' });
    }

    // Transform data to match backend expectations
    const backendData = {
      name: data.personal?.name || '',
      email: data.personal?.email || '',
      location: data.personal?.location || '',
      linkedin_url: data.personal?.linkedin_url || '',
      github_url: data.personal?.github_url || '',
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
        graduation_date: edu.graduation_date || '',
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
        return res.status(response.status).json({ 
          error: `Backend error: ${response.status}`,
          details: errorText,
          backendUrl: backendUrl,
          timestamp: new Date().toISOString()
        });
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      // If it's a PDF, return the file stream
      if (format === 'pdf' || contentType?.includes('application/pdf')) {
        const pdfBuffer = await response.arrayBuffer();
        console.log('PDF buffer size:', pdfBuffer.byteLength);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.setHeader('Content-Length', pdfBuffer.byteLength.toString());
        
        return res.send(Buffer.from(pdfBuffer));
      } else {
        // For other formats, return as text
        const content = await response.text();
        console.log('Text response length:', content.length);
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.tex');
        
        return res.send(content);
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return res.status(408).json({ 
          error: 'Request timeout',
          details: 'Backend request took too long to respond',
          backendUrl: backendUrl
        });
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('API route error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    });
  }
}
