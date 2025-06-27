import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  maxDuration: 10,
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

  console.log('API route called - download-stats');

  try {
    const backendUrl = process.env.BACKEND_URL || 
                      process.env.NEXT_PUBLIC_BACKEND_URL || 
                      'https://resumegen-780f.onrender.com';

    if (req.method === 'GET') {
      // Get download statistics
      const response = await fetch(`${backendUrl}/download-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ResumeGen-Frontend/1.0'
        }
      });

      if (!response.ok) {
        console.error('Backend error:', response.status);
        return res.status(response.status).json({ 
          error: `Backend error: ${response.status}`,
          timestamp: new Date().toISOString()
        });
      }

      const stats = await response.json();
      return res.status(200).json(stats);
    }

    if (req.method === 'POST') {
      // Record a download
      const { format = 'pdf', success = true } = req.body;

      const response = await fetch(`${backendUrl}/download-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ResumeGen-Frontend/1.0'
        },
        body: JSON.stringify({ format, success })
      });

      if (!response.ok) {
        console.error('Backend error:', response.status);
        return res.status(response.status).json({ 
          error: `Backend error: ${response.status}`,
          timestamp: new Date().toISOString()
        });
      }

      const result = await response.json();
      return res.status(200).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Download stats API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
