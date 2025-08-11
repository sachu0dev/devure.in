import { MetadataRoute } from "next";
import { getCurrentDomain, getCanonicalDomain } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/*", "/blog/category/*", "/blog/tag/*"],
        disallow: ["/admin", "/api", "/_next", "/private"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog", "/blog/*", "/blog/category/*", "/blog/tag/*"],
        disallow: ["/admin", "/api", "/_next", "/private"],
      },
    ],
    sitemap: [
      `${canonicalDomain}/sitemap.xml`,
      `${canonicalDomain}/blog/sitemap.xml`,
    ],
    host: currentDomain,
  };
}
