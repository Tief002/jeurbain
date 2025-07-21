/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during build for deployment
    // Re-enable after fixing all warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checks during build
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig