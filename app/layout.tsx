import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Rudransh Villa | Private Luxury Homestay in Udaipur",
    template: "%s | Rudransh Villa",
  },
  description: "Discover Rudransh Villa, a private luxury homestay in Udaipur, Rajasthan. Plan an unhurried stay by the pool.",
  keywords: ["Rudransh Villa", "luxury villa Udaipur", "private villa Udaipur", "luxury homestay Udaipur", "Udaipur villa with pool"],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Rudransh Villa",
  description: "Private luxury homestay in Udaipur, Rajasthan.",
  email: "rudranshvillaudaipur@gmail.com",
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning className={`${sans.variable} ${display.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</body></html>;
}
