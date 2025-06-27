import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  maxDuration: 10,
  runtime: 'nodejs',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API route called - health');

  try {
    const backendUrl = process.env.BACKEND_URL || 
                      process.env.NEXT_PUBLIC_BACKEND_URL || 
                      'https://resumegen-780f.onrender.com';

    const startTime = Date.now();
    
    // Check backend health
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'ResumeGen-Frontend/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        frontend: {
          status: 'healthy',
          environment: process.env.NODE_ENV,
          version: '1.0.0'
        },
        backend: {
          status: response.ok ? 'healthy' : 'unhealthy',
          url: backendUrl,
          responseTime: `${responseTime}ms`,
          httpStatus: response.status
        }
      };

      if (response.ok) {
        try {
          const backendHealth = await response.json();
          healthData.backend = { ...healthData.backend, ...backendHealth };
        } catch {
          // Backend health endpoint might not return JSON
        }
      }

      return res.status(response.ok ? 200 : 503).json(healthData);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      return res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        frontend: {
          status: 'healthy',
          environment: process.env.NODE_ENV,
          version: '1.0.0'
        },
        backend: {
          status: 'unhealthy',
          url: backendUrl,
          responseTime: `${responseTime}ms`,
          error: fetchError instanceof Error ? fetchError.message : 'Connection failed'
        }
      });
    }

  } catch (error) {
    console.error('Health check API error:', error);
    return res.status(500).json({ 
      status: 'error',
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
