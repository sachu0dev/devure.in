/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://devure.in",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://devure.in/sitemap.xml"],
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
};
