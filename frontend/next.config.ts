import path from "path";
import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from "webpack"; // ✅ Correct import
import { BrowserRouter } from "react-router-dom";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@components": path.resolve(__dirname, "src/components"),
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  server: {
    port: 3001,
  },
};

export default nextConfig;
