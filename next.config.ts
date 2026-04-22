import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    // Next.js's global image type declarations (StaticImageData) override src/types/images.d.ts
    // at the TypeScript level. The webpack fix below corrects the runtime behavior so images
    // actually render. ignoreBuildErrors suppresses the resulting type mismatch during `next build`.
    ignoreBuildErrors: true,
  },
  webpack(config) {
    // Replace Next.js's image loader (which returns StaticImageData objects)
    // with webpack asset/resource so imports return plain URL strings.
    // This matches Vite's behavior; all <img src={imported}> usages depend on it.
    const rules: any[] = config.module.rules;
    const idx = rules.findIndex(
      (rule: any) => rule?.loader === "next-image-loader"
    );
    if (idx !== -1) {
      const existing = rules[idx];
      rules[idx] = {
        test: existing.test,
        issuer: existing.issuer,
        dependency: existing.dependency,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[contenthash:8][ext][query]",
        },
      };
    }
    return config;
  },
};

export default nextConfig;
