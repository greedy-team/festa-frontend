import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
        ? "/:path*"
        : "/showcase/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    }];
  },
};

export default nextConfig;
