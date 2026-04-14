import { createRequire } from "node:module";
import path from "node:path";
import type { NextConfig } from "next";

const require = createRequire(import.meta.url);
const backendSourceDirectory = path.resolve(__dirname, "../backend/src");
const repoRootDirectory = path.resolve(__dirname, "..");
const nextAuthPackageDirectory = path.dirname(
  require.resolve("next-auth/package.json"),
);

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: repoRootDirectory,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@oeas/backend": backendSourceDirectory,
      "next-auth": nextAuthPackageDirectory,
    };

    return config;
  },
};

export default nextConfig;
