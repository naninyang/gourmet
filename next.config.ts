import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  sassOptions: {
    api: 'modern',
    silenceDeprecations: ['legacy-js-api'],
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `
      @use 'designSystem.sass' as design
    `,
  },
};

export default nextConfig;
