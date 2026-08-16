import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stay Policies",
  description: "Read the stay, check-in, pool safety and house rules for Rudransh Villa.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return <main className="seo-stay">
    <header className="seo-stay-nav"><Link href="/" className="seo-stay-brand">RUDRANSH <span>VILLA</span></Link><Link href="/#contact" className="seo-stay-nav-cta">Check availability</Link></header>
    <section className="seo-stay-faq"><p className="seo-stay-label">Stay policies</p><h1>Simple rules for<br /><em>easy stays.</em></h1><div>
      <details open><summary>Check-in and check-out<span>+</span></summary><p>Standard check-out time is 10:00 AM. Please confirm arrival arrangements and any timing requests with the villa team before your stay.</p></details>
      <details><summary>Pool safety<span>+</span></summary><p>Pool hours are 7:00 AM to 7:00 PM. Children and minors require the continuous, close supervision of a responsible adult. Running, diving, rough play and glass containers are not permitted in or around the pool.</p></details>
      <details><summary>Registered guests and visitors<span>+</span></summary><p>Only registered guests may stay at the property. Any visitor requires prior approval from the villa team and may need to provide identification.</p></details>
      <details><summary>Quiet time and respectful stays<span>+</span></summary><p>Please respect quiet hours from 10:00 PM to 7:00 AM. Parties, excessive noise and commercial activity require prior written approval from the villa team.</p></details>
      <details><summary>Alcohol and prohibited items<span>+</span></summary><p>Alcohol is not permitted anywhere on the property. Illegal activity, weapons, illegal drugs and hazardous materials are strictly prohibited.</p></details>
      <details><summary>Property care<span>+</span></summary><p>Please take reasonable care of the villa and report loss, damage or safety concerns promptly. The primary guest is responsible for damage caused by their group, children or visitors, subject to applicable law.</p></details>
      <details><summary>Safety and property access<span>+</span></summary><p>Follow reasonable safety instructions from the villa team. Access to a facility may be stopped where needed for safety, maintenance or a rule violation.</p></details>
    </div><Link href="/#contact" className="seo-stay-button">Ask about your stay <span>↗</span></Link></section>
    <footer className="seo-stay-footer"><span>© Rudransh Villa</span><Link href="/">Return to home</Link></footer>
  </main>;
}
