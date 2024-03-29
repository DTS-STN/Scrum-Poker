//formatting TC Date
const builddate = process.env.NEXT_PUBLIC_BUILD_DATE
  ? process.env.NEXT_PUBLIC_BUILD_DATE.substring(0, 4) +
    '-' +
    process.env.NEXT_PUBLIC_BUILD_DATE.substring(4, 6) +
    '-' +
    process.env.NEXT_PUBLIC_BUILD_DATE.substring(6, 8)
  : 'DATE-NA'

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '0',
  },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; object-src 'none'; script-src-elem 'self'; script-src 'self' 'unsafe-eval'; connect-src 'self' https://*.bdm-dev.dts-stn.com" +
        process.env.NODE_ENV ===
      'development'
        ? ' http://localhost:4000/graphql'
        : '' +
          "; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:",
  },
]

module.exports = {
  images: {
    dangerouslyAllowSVG: true,
  },

  env: {
    NEXT_PUBLIC_BUILD_DATE: builddate,
  },

  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    //GraphQL loader for .graphql files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })

    return config
  },
  //
  // i18n setup
  //
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  //
  // rewrites setup
  //
  // async rewrites() {
  //   return [
  //     {
  //       source: '/accueil',
  //       destination: '/home',
  //     },
  //     // {
  //     //   source: " french page name with/without route ",
  //     //   destination: " 'english' page ",
  //     // },
  //   ]
  // },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
