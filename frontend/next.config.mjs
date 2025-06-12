/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/assistant",
        destination: "http://localhost:8000/emails/generate/stream",
      },
    ];
  },
};

export default nextConfig;
