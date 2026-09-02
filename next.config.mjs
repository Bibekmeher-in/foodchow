/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.foodchow.com',
      },
      {
        protocol: 'https',
        hostname: 'www.foodchow.com',
      },
      {
        protocol: 'https',
        hostname: 'foodchow.com',
      },
      {
        protocol: 'https',
        hostname: 'foodchowdemoindia.foodchow.com',
      }
    ],
  },
};

export default nextConfig;
