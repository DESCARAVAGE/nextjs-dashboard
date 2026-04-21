import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.join(__dirname), // Or path.resolve(__dirname, '../../') for monorepo apps
  },
};

export default nextConfig;
