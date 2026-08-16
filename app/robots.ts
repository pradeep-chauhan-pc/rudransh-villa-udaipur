import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://rudransh-villa-udaipur.vercel.app").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/guest-entry", "/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
