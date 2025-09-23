const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'https://aitoolscover.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [], // kuch bhi exclude nahi karna
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
    ],
    additionalSitemaps: [`${SITE_URL}/sitemap`],
    transformRobotsTxt: async (robotsTxt) => {
      return `# *\n${robotsTxt}\n\n# Host\nHost: ${SITE_URL}`
    },
  },
}
