import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getWaitlistEntry } from "~/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");

    if (!fid) {
      return new Response("FID parameter is required", { status: 400 });
    }

    // Get waitlist entry
    const entry = await getWaitlistEntry(fid);

    if (!entry) {
      return new Response("Waitlist entry not found", { status: 404 });
    }

    // Format card number with leading zeros
    const cardNumberFormatted = `#${entry.cardNumber
      .toString()
      .padStart(4, "0")}`;

    return new ImageResponse(
      (
        <div
          tw="flex h-full w-full flex-col justify-center items-center relative"
          style={{
            background: "linear-gradient(90deg, #A6EC9C 0%, #B8EF92 100%)",
          }}
        >
          <div tw="flex flex-col items-center justify-center text-center p-16">
            <div tw="flex w-32 h-32 rounded-full overflow-hidden mb-8 items-center justify-center">
              <img
                src={`${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/icon.png`}
                alt="Blitz Icon"
                tw="w-28 h-28 object-contain"
              />
            </div>

            <h1
              tw="text-black mb-4"
              style={{
                fontSize: "48px",
                fontWeight: "700",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              @{entry.username}
            </h1>

            {entry.displayName && entry.displayName !== entry.username && (
              <p
                tw="text-gray-800 mb-6"
                style={{
                  fontSize: "32px",
                  fontWeight: "400",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {entry.displayName}
              </p>
            )}

            <div
              tw="bg-black text-white px-8 py-4 rounded-full mb-8"
              style={{
                fontSize: "36px",
                fontWeight: "900",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {cardNumberFormatted}
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
    console.error("Error generating waitlist card:", error);
    return new Response("Error generating card", { status: 500 });
  }
}
