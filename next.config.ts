import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**", // Mengizinkan semua folder/file dari domain ini
      },
    ],
  },
};

export default nextConfig;
