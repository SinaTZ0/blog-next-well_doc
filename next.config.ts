import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Added because the @next/bundle-analyzer
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// export default nextConfig;
module.exports = withBundleAnalyzer(nextConfig);
