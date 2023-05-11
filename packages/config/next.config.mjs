import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig}*/
export default withBundleAnalyzer(
  {
    reactStrictMode: true,
    images: {
      domains: ['gitlab.com'],
    },
  }
);
