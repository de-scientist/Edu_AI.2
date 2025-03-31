import path from "path";
import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from "webpack"; // ✅ Correct import
import { BrowserRouter } from "react-router-dom";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        ' *.svg': {
          loaders: [ '@svgr/webpack'],
          as: '*.js',
        },
      },
      resolveAlias: {
        underscore: 'lodash',
        mocha: { BrowserRouter: 'mocha/browser-entry.js' },
      },
      resolveExtensions: [
         '.mdx',
         '.tsx',
         '.ts',
         '.jsx',
         '.js',
         '.mjs',
         '.json',
      ],
      moduleIdStrategy: 'deterministic',  
    },
  },


 /* webpack: (config: WebpackConfiguration) => {  // ✅ Use the correct type
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@components": path.resolve(__dirname, "src/components"),
      };
    }
    return config;
  },*/
};

export default nextConfig;
