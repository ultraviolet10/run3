import { NextRequest } from "next/server";
import fs from 'fs';
import path from 'path';

// Use static instead of dynamic to allow caching
export const dynamic = 'force-static';

export async function GET(_request: NextRequest) {
  // Path to the static OpenGraph image
  const imagePath = path.join(process.cwd(), 'public', 'opengraph.png');
  
  // Read the image file
  const imageBuffer = fs.readFileSync(imagePath);
  
  // Return the image with appropriate content type
  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}