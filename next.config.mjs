/** @type {import('next').NextConfig} */
import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.tsx',
  staticImage: true
})

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  images: {
    unoptimized: true
  },
  // Ignore Lint during Build
  eslint: {
    ignoreDuringBuilds: true
  },
  ...(process.env.CF_PAGES === 'true'
    ? { output: 'export' } // Use static output for Cloudflare Pages
    : null)
})
