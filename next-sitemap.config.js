/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thetrurate.org',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://thetrurate.org/sitemap.xml',
    ],
  },
}
