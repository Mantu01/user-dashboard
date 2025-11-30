import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      "res.cloudinary.com",
    ].map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;