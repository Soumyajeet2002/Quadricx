import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_APP_BASE_URL,
  experimental: {
    optimizePackageImports: ["antd", "@ant-design/icons", "lucide-react"],
  },

  async headers() {
    return [
      {
        // Routes this applies to
        source: "/(.*)",
        // Headers
        headers: [
          // Allow for specific domains to have access or * for all
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          // Allows for specific methods accepted
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Allows for specific headers accepted (These are a few standard ones)
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, application/json",
          },
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevent all iframe embedding
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
