import { NextResponse } from 'next/server';

// Configure function timeout for Vercel
export const maxDuration = 10;

// In a real application, you would use a database
// For now, we'll use a simple file-based storage or environment variable
// You should replace this with your actual database implementation

let downloadCount = 0;

// Load initial count from environment or database
if (typeof process !== 'undefined' && process.env.DOWNLOAD_COUNT) {
  downloadCount = parseInt(process.env.DOWNLOAD_COUNT) || 0;
}

export async function GET() {
  try {
    // In a real implementation, fetch from your database
    // const count = await database.getDownloadCount();
    
    return NextResponse.json({ 
      downloadCount: downloadCount,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching download stats:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch download stats',
      downloadCount: 0 
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Increment download count
    downloadCount += 1;
    
    // In a real implementation, save to your database
    // await database.incrementDownloadCount();
    
    return NextResponse.json({ 
      downloadCount: downloadCount,
      success: true 
    });
  } catch (error) {
    console.error('Error updating download stats:', error);
    return NextResponse.json({ 
      error: 'Failed to update download stats' 
    }, { status: 500 });
  }
}
