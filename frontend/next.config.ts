import type { NextConfig } from "next";
import analyze from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
};

const withBundleAnalyzer = analyze({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
