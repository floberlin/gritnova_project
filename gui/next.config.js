/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tasks',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
