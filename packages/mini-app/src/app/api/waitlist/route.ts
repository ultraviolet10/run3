import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist, getWaitlistEntry, type WaitlistData } from '~/lib/waitlist';
import { z } from 'zod';

const WaitlistSchema = z.object({
  fid: z.string(),
  username: z.string(),
  displayName: z.string().optional(),
  pfpUrl: z.string().optional(),
  location: z.union([
    z.string(),
    z.object({
      placeId: z.string().optional(),
      description: z.string().optional(),
    })
  ]).optional().transform((val) => {
    if (typeof val === 'object' && val !== null) {
      return val.description || val.placeId || '';
    }
    return val || '';
  }),
  walletAddress: z.string().optional(),
  signature: z.string(),
  signatureMessage: z.string().optional(),
  chainId: z.string().optional(),
  clientFid: z.string().optional(),
  platformType: z.string().optional(),
  fullContext: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = WaitlistSchema.parse(body);
    
    // Add to waitlist
    const result = await addToWaitlist(validatedData as WaitlistData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully added to waitlist',
        id: result.id
      }, { status: 201 });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Waitlist API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    
    if (!fid) {
      return NextResponse.json({
        success: false,
        error: 'FID parameter is required'
      }, { status: 400 });
    }
    
    const entry = await getWaitlistEntry(fid);
    
    if (entry) {
      return NextResponse.json({
        success: true,
        data: entry
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Entry not found'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Waitlist GET API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
