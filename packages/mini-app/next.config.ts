import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination:
          "https://api.farcaster.xyz/miniapps/hosted-manifest/0198bcbd-f406-599d-896f-d11d07038dd8",
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },
};

export default nextConfig;
