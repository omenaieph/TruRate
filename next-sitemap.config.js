/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.trueratecalculator.org',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.trueratecalculator.org/sitemap.xml',
    ],
  },
}
