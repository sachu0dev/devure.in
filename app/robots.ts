import { MetadataRoute } from "next";
import { getCurrentDomain, getCanonicalDomain } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          // Base pages
          "/",
          "/about-us",
          "/work",
          "/work/*",
          "/service",
          "/service/*",
          "/blog",
          "/blog/*",
          "/blog/category/*",
          "/blog/tag/*",
          "/contact",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/_next",
          "/_next/*",
          "/private",
          "/*.json",
          "/*.xml",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          // Base pages
          "/",
          "/about-us",
          "/work",
          "/work/*",
          "/service",
          "/service/*",
          "/blog",
          "/blog/*",
          "/blog/category/*",
          "/blog/tag/*",
          "/contact",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/_next",
          "/_next/*",
          "/private",
          "/*.json",
          "/*.xml",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: [
          // Base pages
          "/",
          "/about-us",
          "/work",
          "/work/*",
          "/service",
          "/service/*",
          "/blog",
          "/blog/*",
          "/blog/category/*",
          "/blog/tag/*",
          "/contact",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/_next",
          "/_next/*",
          "/private",
          "/*.json",
          "/*.xml",
        ],
      },
    ],
    sitemap: [
      `${canonicalDomain}/sitemap.xml`,
      `${canonicalDomain}/blog/sitemap.xml`,
    ],
    host: currentDomain,
  };
}
