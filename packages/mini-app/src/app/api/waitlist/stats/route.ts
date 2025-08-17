import { NextResponse } from 'next/server';
import { getWaitlistStats } from '~/lib/waitlist';

export async function GET() {
  try {
    const stats = await getWaitlistStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Waitlist stats API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
