// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir conexiones de desarrollo desde la red local
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.0.13:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any, { isServer, webpack }: { isServer: boolean; webpack: any }) => {
    // Para el cliente: excluir módulos de Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        encoding: false,
        util: false,
        buffer: false,
        process: false,
      };

      // Ignorar módulos problemáticos de face-api.js y node-fetch
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(fs|path|encoding|util|os|stream|buffer)$/,
          contextRegExp: /node_modules\/face-api\.js/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^encoding$/,
          contextRegExp: /node_modules\/node-fetch/,
        })
      );
    }

    // Para el servidor: excluir face-api.js completamente
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'face-api.js': 'commonjs face-api.js',
      });
    }

    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.json': ['.json'],
    };

    return config;
  },
};

module.exports = nextConfig;
