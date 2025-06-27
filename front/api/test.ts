import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  maxDuration: 15,
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

  console.log('API route called - test');

  try {
    const backendUrl = process.env.BACKEND_URL || 
                      process.env.NEXT_PUBLIC_BACKEND_URL || 
                      'https://resumegen-780f.onrender.com';

    if (req.method === 'GET') {
      // Basic test endpoint
      const testData = {
        message: 'Test API endpoint is working',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        backend: {
          url: backendUrl,
          configured: !!process.env.BACKEND_URL || !!process.env.NEXT_PUBLIC_BACKEND_URL
        },
        request: {
          method: req.method,
          headers: Object.keys(req.headers),
          userAgent: req.headers['user-agent']
        }
      };

      return res.status(200).json(testData);
    }

    if (req.method === 'POST') {
      // Test backend connectivity with sample data
      const testPayload = {
        name: 'Test User',
        email: 'test@example.com',
        location: 'Test City, TC',
        experiences: [{
          title: 'Test Position',
          company: 'Test Company',
          location: 'Test Location',
          dates: '2023 - Present',
          responsibilities: ['Test responsibility']
        }],
        education: [{
          institution: 'Test University',
          degree: 'Test Degree',
          graduation_date: '2023',
          gpa: '3.5'
        }],
        projects: [{
          title: 'Test Project',
          descriptions: ['Test project description']
        }],
        skills: {
          technical: ['Test Skill']
        }
      };

      console.log('Testing backend connectivity with sample data');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(`${backendUrl}/test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ResumeGen-Frontend/1.0'
          },
          body: JSON.stringify(testPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const result = {
          frontend: {
            status: 'success',
            timestamp: new Date().toISOString()
          },
          backend: {
            status: response.ok ? 'success' : 'error',
            httpStatus: response.status,
            url: backendUrl
          }
        };

        if (response.ok) {
          try {
            const backendResponse = await response.json();
            result.backend = { ...result.backend, response: backendResponse };
          } catch {
            const textResponse = await response.text();
            result.backend = { ...result.backend, response: textResponse };
          }
        } else {
          const errorText = await response.text();
          result.backend = { ...result.backend, error: errorText };
        }

        return res.status(200).json(result);

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        return res.status(200).json({
          frontend: {
            status: 'success',
            timestamp: new Date().toISOString()
          },
          backend: {
            status: 'error',
            url: backendUrl,
            error: fetchError instanceof Error ? fetchError.message : 'Connection failed'
          }
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Test API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
