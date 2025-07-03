/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
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
  async headers () {
    return [
      {
        source: "/embed", 
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://piyasgendrive-waitlist.created.app"
          }
        ]
      }
    ]
  }
};
export default nextConfig;
