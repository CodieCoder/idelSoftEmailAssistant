/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/assistant/subject",
        destination: "http://localhost:8000/emails/generate/subject/stream",
      },
      {
        source: "/api/assistant/body",
        destination: "http://localhost:8000/emails/generate/body/stream",
      },
    ];
  },
};

export default nextConfig;
