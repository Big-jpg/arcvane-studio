import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/custom",
        destination: "/contact",
        permanent: false,
      },
      {
        source: "/pickup",
        destination: "/shipping",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        // Shopify CDN images
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        // Vercel Blob public product images
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
