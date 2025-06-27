import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('Health check API called');
  
  try {
    const backendUrl = process.env.BACKEND_URL || 
                      process.env.NEXT_PUBLIC_BACKEND_URL || 
                      'https://resumegen-780f.onrender.com';
    
    console.log('Testing backend at:', backendUrl);
    
    // Test backend connectivity with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    let backendHealth = null;
    let backendStatus = 'error';
    let backendStatusCode = 0;
    let backendError = null;

    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ResumeGen-HealthCheck/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      backendStatusCode = response.status;
      
      if (response.ok) {
        backendHealth = await response.json();
        backendStatus = 'ok';
      } else {
        backendError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      backendError = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      console.error('Backend health check failed:', backendError);
    }

    const healthResponse = {
      status: 'healthy',
      frontend: {
        status: 'ok',
        environment: process.env.NODE_ENV || 'unknown',
        version: '1.0.0'
      },
      backend: {
        url: backendUrl,
        status: backendStatus,
        statusCode: backendStatusCode,
        data: backendHealth,
        error: backendError
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        BACKEND_URL: process.env.BACKEND_URL ? 'set' : 'not set',
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL ? 'set' : 'not set'
      },
      timestamp: new Date().toISOString()
    };

    console.log('Health check result:', healthResponse);

    return NextResponse.json(healthResponse, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      frontend: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      backend: {
        status: 'unknown'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
