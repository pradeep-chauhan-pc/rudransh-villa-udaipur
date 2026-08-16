import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://rudransh-villa-udaipur.vercel.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/luxury-villa-udaipur", "/private-pool-villa-udaipur", "/homestay-in-udaipur", "/faq", "/policies"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
