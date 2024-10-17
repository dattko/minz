import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `@import "functions.scss"; @import "mixin.scss"; @import "base.scss";`,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  reactStrictMode: false,
  experimental: {
     serverActions: {
      bodySizeLimit: '20mb',
     }
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;