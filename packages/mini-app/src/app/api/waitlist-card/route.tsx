import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getWaitlistEntry } from "~/lib/waitlist";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return new Response('FID parameter is required', { status: 400 });
    }

    // Get waitlist entry
    const entry = await getWaitlistEntry(fid);
    
    if (!entry) {
      return new Response('Waitlist entry not found', { status: 404 });
    }

    // Format card number with leading zeros
    const cardNumberFormatted = `#${entry.cardNumber.toString().padStart(4, '0')}`;

    return new ImageResponse(
      (
        <div
          tw="flex h-full w-full flex-col justify-center items-center relative"
          style={{
            background: 'linear-gradient(135deg, #161616 0%, #2a2a2a 100%)',
          }}
        >
          {/* Background pattern */}
          <div
            tw="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 35%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.1) 65%, transparent 65%),
                linear-gradient(-45deg, transparent 35%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.1) 65%, transparent 65%)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          
          {/* Main card content */}
          <div tw="flex flex-col items-center justify-center text-center p-16">
            {/* Profile picture */}
            {entry.pfpUrl && (
              <div tw="flex w-32 h-32 rounded-full overflow-hidden mb-8 border-4 border-white">
                <img src={entry.pfpUrl} alt="Profile" tw="w-full h-full object-cover" />
              </div>
            )}
            
            {/* Username */}
            <h1 
              tw="text-white mb-4"
              style={{
                fontSize: '48px',
                fontWeight: '700',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              @{entry.username}
            </h1>
            
            {/* Display name if different from username */}
            {entry.displayName && entry.displayName !== entry.username && (
              <p 
                tw="text-gray-300 mb-6"
                style={{
                  fontSize: '32px',
                  fontWeight: '400',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {entry.displayName}
              </p>
            )}
            
            {/* Card number */}
            <div 
              tw="bg-white text-black px-8 py-4 rounded-full mb-8"
              style={{
                fontSize: '36px',
                fontWeight: '900',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {cardNumberFormatted}
            </div>
            
            {/* Blitz branding */}
            <div tw="flex flex-col items-center">
              <h2 
                tw="text-white mb-2"
                style={{
                  fontSize: '32px',
                  fontWeight: '900',
                  letterSpacing: '2px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                BLITZ WAITLIST
              </h2>
              <p 
                tw="text-gray-400"
                style={{
                  fontSize: '20px',
                  fontWeight: '500',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                THE ARENA FOR CREATOR COINS
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    );
  } catch (error) {
    console.error('Error generating waitlist card:', error);
    return new Response('Error generating card', { status: 500 });
  }
}
