/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ippzsopluprmrrpxosmm.supabase.co",
      },
    ],
  },
  // headers() function removed
};

export default nextConfig;
