import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "mycoffeeai.connet.co.kr",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;