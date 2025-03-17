import path from "path";
import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from "webpack"; // ✅ Correct import

const nextConfig: NextConfig = {
  webpack: (config: WebpackConfiguration) => {  // ✅ Use the correct type
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@components": path.resolve(__dirname, "src/components"),
      };
    }
    return config;
  },
};

export default nextConfig;
