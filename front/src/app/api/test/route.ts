import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL || 'not-vercel'
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'POST method works!',
    timestamp: new Date().toISOString()
  });
}
