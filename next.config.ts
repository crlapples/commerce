export default {
  // experimental: {
  //   ppr: true,
  //   inlineCss: false, // Updated based on previous interaction
  //   useCache: false
  // },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  }
};
