import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "Rudransh Villa | Private Luxury Homestay in Udaipur",
    template: "%s | Rudransh Villa",
  },
  description: "Discover Rudransh Villa, a private luxury homestay in Udaipur, Rajasthan. Plan an unhurried stay by the pool.",
  keywords: ["Rudransh Villa", "luxury villa Udaipur", "private villa Udaipur", "luxury homestay Udaipur", "Udaipur villa with pool"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Rudransh Villa",
    title: "Rudransh Villa | Private Luxury Homestay in Udaipur",
    description: "A private villa stay with a swimming pool, garden, and room for time together.",
    images: [{ url: "/images/rudransh-villa-concept-hero.png", width: 1680, height: 1120, alt: "Poolside view at Rudransh Villa" }],
  },
  twitter: { card: "summary_large_image", title: "Rudransh Villa | Private Luxury Homestay", description: "A private villa stay with a pool and garden.", images: ["/images/rudransh-villa-concept-hero.png"] },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LodgingBusiness",
      ...(siteUrl ? { "@id": `${siteUrl}/#lodgingbusiness` } : {}),
      name: "Rudransh Villa",
      description: "Private luxury homestay in Udaipur, Rajasthan.",
      telephone: "+91-9251158345",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near Padmini Bagh Resort, Gudli Panchayat",
        addressLocality: "Udaipur",
        addressRegion: "Rajasthan",
        postalCode: "313024",
        addressCountry: "IN",
      },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Swimming pool", value: true },
        { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
        { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
        { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
      ],
    },
    { "@type": "WebSite", name: "Rudransh Villa", ...(siteUrl ? { url: siteUrl } : {}) },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning className={`${sans.variable} ${display.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</body></html>;
}
