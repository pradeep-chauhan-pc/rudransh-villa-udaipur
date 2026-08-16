import type { Metadata } from "next";
import Link from "next/link";

const questions = [
  ["Is Rudransh Villa an entire private property?", "Rudransh Villa is designed for private stays, so your group can enjoy its shared spaces, garden and pool together. Confirm availability and stay arrangements with the villa team before booking."],
  ["How many bedrooms does the villa have?", "The property has two bedrooms. Share your group size and dates through WhatsApp so the villa team can confirm the best stay arrangement."],
  ["Does the villa have a private swimming pool?", "Yes. The villa includes a swimming pool. Pool hours are 7:00 AM to 7:00 PM, and children must have continuous adult supervision."],
  ["What facilities are available?", "The villa includes air-conditioned spaces, Wi-Fi, parking, garden areas, living spaces and a swimming pool."],
  ["How do I check availability?", "Use the availability form on the homepage. It prepares a WhatsApp message with your name, dates and group size for the villa team."],
];

export const metadata: Metadata = {
  title: "Villa Stay FAQs",
  description: "Answers to common questions about Rudransh Villa, a private 2 BHK villa stay with a pool and garden in Udaipur.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  return <main className="seo-stay">
    <header className="seo-stay-nav"><Link href="/" className="seo-stay-brand">RUDRANSH <span>VILLA</span></Link><Link href="/#contact" className="seo-stay-nav-cta">Check availability</Link></header>
    <section className="seo-stay-faq"><p className="seo-stay-label">Helpful details</p><h1>Questions before<br /><em>your stay.</em></h1><div>{questions.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div><Link href="/#contact" className="seo-stay-button">Check availability <span>↗</span></Link></section>
    <footer className="seo-stay-footer"><span>© Rudransh Villa</span><Link href="/">Return to home</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </main>;
}
