import { withPayload } from '@payloadcms/next/withPayload';
import redirects from './redirects.js';

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during build (for deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Add Sass configuration to suppress deprecation warnings
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
    quietDeps: true,
  },

  images: {
    remotePatterns: [
      // Allow your own server
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item);
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        };
      }),
      // Allow Google profile images
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    // Preserve extension aliases
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };

    // Enhanced Sass loader configuration to fix Payload warnings
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((one) => {
          if (Array.isArray(one.use)) {
            one.use.forEach((u) => {
              // Fix for sass-loader
              if (u.loader?.includes('sass-loader')) {
                u.options = {
                  ...u.options,
                  sassOptions: {
                    ...u.options?.sassOptions,
                    silenceDeprecations: ['legacy-js-api'],
                    quietDeps: true,
                  },
                };
              }
            });
          }
        });
      }
    });

    // Suppress infrastructure logging for cleaner output
    config.infrastructureLogging = {
      level: 'error',
    };

    // Filter out repetitive deprecation warnings from console
    if (!isServer) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args.join(' ');
        if (
          message.includes('repetitive deprecation warnings omitted') ||
          message.includes('@payloadcms/ui') ||
          (message.includes('deprecation') && message.includes('sass-loader'))
        ) {
          return; // Skip these warnings
        }
        originalWarn.apply(console, args);
      };
    }

    return config;
  },

  reactStrictMode: true,
  redirects,
};

export default withPayload(nextConfig, { devBundleServerPackages: false });