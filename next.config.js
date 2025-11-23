/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Jenga-UI',
  images: {
    unoptimized: true,
  },
  eslint: {
    dirs: ['src'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig