import baseConfig from '@mbg/config/next.config.mjs';
import withTM from 'next-transpile-modules';
import path from 'node:path'
import url from 'node:url'

/** @type {import('next').NextConfig}*/
const config = withTM(['@mbg/ui', '@mbg/api-platform'])({
  ...baseConfig,
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: path.join(path.dirname(url.fileURLToPath(import.meta.url)), '../../'),
  }
});

export default config;
