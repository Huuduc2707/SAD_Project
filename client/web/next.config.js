/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ]
  },
  redirects() {
    return [
      {
        source: '/',
        destination: '/check-ins',
        permanent: false,
      },
    ]
  }
};

module.exports = nextConfig;
