import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daviddomingo.dev",
      },
    ],
  },
};

export default nextConfig;
