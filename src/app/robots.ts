import type { MetadataRoute } from "next";
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/thank-you", "/api/"],
      },
    ],
    sitemap: "https://cirostack.com/sitemap.xml",
    host: "https://cirostack.com",
  };
}
