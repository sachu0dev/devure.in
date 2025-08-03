/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://devure.in",
  generateRobotsTxt: false, // We're using dynamic robots.ts
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
  },
};
