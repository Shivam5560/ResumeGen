import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://resumegen-780f.onrender.com';
    
    // Test backend connectivity
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10 seconds
    });

    const backendHealth = response.ok ? await response.json() : null;

    return NextResponse.json({
      status: 'healthy',
      frontend: 'ok',
      backend: {
        url: backendUrl,
        status: response.ok ? 'ok' : 'error',
        statusCode: response.status,
        data: backendHealth
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      frontend: 'ok',
      backend: {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
