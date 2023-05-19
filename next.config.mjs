/** @type {import('next').NextConfig} */
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx',
  staticImage: true
})

export default withNextra({
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // Ignore Lint during Build
  eslint: {
    ignoreDuringBuilds: true
  },
  async redirects() {
    return [
      {
        source: '/commission',
        destination: '/',
        permanent: true
      }
    ]
  }
})
