import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cpus: 1,
  },
  staticGenerationMaxConcurrency: 1,
};

export default nextConfig;
