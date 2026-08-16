import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/luxury-villa-udaipur", "/private-pool-villa-udaipur", "/homestay-in-udaipur", "/faq", "/policies"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
