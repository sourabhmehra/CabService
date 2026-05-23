/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE;

    if (apiBase) {
      // Production (Vercel): NEXT_PUBLIC_API_BASE is set to the Render URL.
      // Client code uses it directly — no proxy/rewrite needed.
      return [];
    }

    // Local development only: proxy /api/* → local FastAPI on port 8000
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
