const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'https://aitoolscover.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // Ye option sitemap.xml ko generate karne se rok dega
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap`],
  },
}
