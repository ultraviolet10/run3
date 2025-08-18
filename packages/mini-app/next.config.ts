import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination:
          "https://api.farcaster.xyz/miniapps/hosted-manifest/0198bcd3-884e-f7a6-5d60-7fc5839caa07",
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },
};

export default nextConfig;
