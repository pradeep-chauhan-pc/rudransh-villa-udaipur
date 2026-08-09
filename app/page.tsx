"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionProps } from "framer-motion";

const moments = [
  ["SCENE I", "Arrive and exhale", "Set your bags down, step into your private stay, and let the usual pace fall away."],
  ["SCENE II", "The waterline", "When the afternoon asks less of you, the pool becomes the only plan worth keeping."],
  ["FINAL SCENE", "Evening together", "As daylight softens, make room for conversations, shared meals, and unhurried time with your people."],
];

const villaSpaces = [
  ["01", "Rooms", "A softer place to wake, rest and close the day.", "villa-space-room"],
  ["02", "Pool", "Slow water, open sky and time with your people.", "villa-space-pool"],
  ["03", "Garden", "A quieter outdoor pause between the moments of the day.", "villa-space-garden"],
  ["04", "Kitchen & dining", "The shared space for long meals and easy conversation.", "villa-space-kitchen"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquiryState, setInquiryState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const reducedMotion = useReducedMotion();
  const reveal: MotionProps = reducedMotion ? {} : { initial: { opacity: 0, y: 34 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.18 }, transition: { duration: 0.75, ease: "circOut" } };
  const cityStoryRef = useRef<HTMLElement>(null);
  const { scrollYProgress: cityStoryProgress } = useScroll({ target: cityStoryRef, offset: ["start end", "end start"] });
  const cityImageY = useTransform(cityStoryProgress, [0, 1], ["-7%", "7%"]);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const checkIn = String(formData.get("checkIn") ?? "");
    const checkOut = String(formData.get("checkOut") ?? "");
    if (checkIn && checkOut && checkOut <= checkIn) {
      setInquiryState("error");
      setInquiryMessage("Please select a check-out date after your check-in date.");
      return;
    }
    setInquiryState("sending");
    setInquiryMessage("");
    try {
      const response = await fetch("/api/enquiry", { method: "POST", body: formData });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Your inquiry could not be sent.");
      setInquiryState("sent");
      setInquiryMessage(result.message || "Thank you. The villa team will be in touch shortly.");
      form.reset();
    } catch (error) {
      setInquiryState("error");
      setInquiryMessage(error instanceof Error ? error.message : "Your inquiry could not be sent. Please try again.");
    }
  }

  return (
    <main className="villa-site">
      <header className="villa-nav">
        <a className="villa-wordmark" href="#top" aria-label="Rudransh Villa home">
          <Image className="villa-logo" src="/rudransh-villa-logo.png" alt="" width={48} height={48} priority />
          <span>RUDRANSH <small>VILLA</small></span>
        </a>
        <button className="villa-menu" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav className={menuOpen ? "villa-links is-open" : "villa-links"} aria-label="Main navigation">
          <a href="#stay" onClick={() => setMenuOpen(false)}>The stay</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="villa-nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Enquire</a>
        </nav>
      </header>

      <section className="villa-hero" id="top">
        <motion.div className="villa-hero-art" aria-hidden="true" animate={reducedMotion ? undefined : { scale: [1, 1.045], x: [0, -12] }} transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}><i /><i /><i /></motion.div>
        <motion.div className="villa-hero-copy" initial={reducedMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          <p className="villa-kicker">A private Udaipur homestay</p>
          <h1>Where the day<br />learns to <em>linger.</em></h1>
          <p className="villa-intro">Rudransh Villa is a slower way into Udaipur—framed by water, open sky, and the comfort of having nowhere else to be.</p>
          <div className="villa-actions">
            <a className="villa-button" href="#contact">Plan your stay <span>↗</span></a>
            <a className="villa-text-link" href="#stay">Discover Rudransh <span>↓</span></a>
          </div>
        </motion.div>
        <div className="villa-hero-note"><span>01</span><span>Begin the journey<br />beyond the city</span></div>
      </section>

      <motion.section className="villa-manifesto" id="stay" {...reveal}>
        <p className="villa-kicker">Chapter one · Arrival</p>
        <div className="villa-split-heading">
          <h2>Leave the city.<br />Keep the <em>feeling.</em></h2>
          <p>There is a different pace once you reach the villa. Fewer decisions. Longer pauses. A stay shaped around the people you arrived with.</p>
        </div>
        <div className="villa-marquee" aria-label="Private · Udaipur · Poolside · Unhurried">
          <span>PRIVATE</span><b>✦</b><span>UDAIPUR</span><b>✦</b><span>POOLSIDE</span><b>✦</b><span>UNHURRIED</span><b>✦</b>
        </div>
      </motion.section>

      <motion.section className="villa-arrival" {...reveal}>
        <div className="villa-arrival-image" aria-hidden="true" />
        <div className="villa-arrival-story"><p className="villa-kicker">A private arrival</p><span className="villa-chapter-number">01</span><h2>Let Udaipur<br />open <em>slowly.</em></h2><p>Past the usual rush, a quieter address waits. It is a place to arrive without performing the holiday—just step in, exhale, and let the day unfold.</p></div>
      </motion.section>

      <motion.section className="villa-spaces" aria-label="Inside Rudransh Villa" {...reveal}>
        <div className="villa-spaces-heading"><p className="villa-kicker">Inside Rudransh</p><h2>Every corner has<br />a part in the <em>story.</em></h2><p>From a calm room to the garden, pool and shared kitchen, the villa is made for a stay that unfolds naturally.</p></div>
        <div className="villa-space-grid">
          {villaSpaces.map(([number, title, copy, imageClass], index) => <motion.article className={`villa-space-card ${imageClass}`} key={title} initial={reducedMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: reducedMotion ? 0 : index * 0.1, ease: "circOut" }}>
            <div className="villa-space-image" aria-hidden="true" /><div className="villa-space-copy"><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>
          </motion.article>)}
        </div>
      </motion.section>

      <motion.section className="villa-city-story" id="experience" ref={cityStoryRef} {...reveal}>
        <motion.div className="villa-city-story-image" aria-hidden="true" style={reducedMotion ? undefined : { y: cityImageY }} />
        <span className="villa-film-edge" aria-hidden="true" />
        <div className="villa-city-story-copy"><p className="villa-kicker">Opening frame · Rudransh Villa</p><span className="villa-story-count">01 <i /> 03</span><h2>A private place<br />to <em>stay longer.</em></h2><p>From the first quiet moment to the last unhurried evening, every part of the villa is made for being together without a schedule.</p><span className="villa-scene-direction">FADE IN · YOUR STAY BEGINS</span></div>
      </motion.section>

      <motion.section className="villa-rhythm" {...reveal}>
        <div className="villa-rhythm-heading"><p className="villa-kicker">A stay in three scenes</p><span className="villa-journey-line" aria-hidden="true"><i /></span><h2>Your time here,<br /><em>unfolding slowly.</em></h2></div>
        <div className="villa-rhythm-grid">
          {moments.map(([number, title, copy], index) => <motion.article className="villa-rhythm-card" key={number} initial={reducedMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: reducedMotion ? 0 : index * 0.14, ease: "circOut" }}><span>{number}</span><h3>{title}</h3><p>{copy}</p></motion.article>)}
        </div>
      </motion.section>

      <motion.section className="villa-pool-simple" {...reveal}>
        <motion.div initial={reducedMotion ? false : { opacity: 0, x: -34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: "circOut" }}><p className="villa-kicker">Final frame · Rudransh Villa</p><span className="villa-story-count">03 <i /> 03</span><h2>Slow afternoons.<br /><em>Still evenings.</em></h2><p>Enjoy the pool between 7 AM and 7 PM, settle into air-conditioned comfort, and let the villa be the part of Udaipur that is entirely yours.</p><a className="villa-button" href="#contact">Start your story <span>↗</span></a></motion.div>
      </motion.section>

      <motion.section className="villa-contact" id="contact" {...reveal}>
        <p className="villa-kicker">The final chapter is yours</p>
        <h2>Bring your people.<br />We will hold the <em>moment.</em></h2>
        <p>Maybe it is a quiet family escape, a long-awaited reunion, or simply a few days near Udaipur&apos;s lakes and old-city glow. Tell us your dates and we will help shape the stay around you.</p>
        <form className="villa-inquiry-form" onSubmit={submitInquiry}>
          <label><span>Your name</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Full name" /></label>
          <label><span>Mobile number</span><input name="mobile" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9 +()\-]{10,15}" minLength={10} maxLength={15} required placeholder="10-digit mobile number" /></label>
          <label><span>Email <em>optional</em></span><input name="email" type="email" autoComplete="email" placeholder="name@example.com" /></label>
          <label><span>Guests</span><select name="guests" defaultValue="2" required>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
          <label><span>Check-in</span><input name="checkIn" type="date" required /></label>
          <label><span>Check-out</span><input name="checkOut" type="date" required /></label>
          <label className="villa-inquiry-note"><span>Your note <em>optional</em></span><textarea name="message" rows={3} maxLength={1000} placeholder="Tell us what you have in mind" /></label>
          <button className="villa-inquiry-submit" type="submit" disabled={inquiryState === "sending"}>{inquiryState === "sending" ? "Sending inquiry…" : "Send inquiry"}<span aria-hidden="true">↗</span></button>
          {inquiryMessage && <p className={`villa-inquiry-status ${inquiryState}`} role="status">{inquiryMessage}</p>}
        </form>
        <a className="villa-contact-email" href="mailto:rudranshvillaudaipur@gmail.com">rudranshvillaudaipur@gmail.com <span>↗</span></a>
      </motion.section>

      <footer className="villa-footer"><span>© Rudransh Villa</span><nav aria-label="Stay guides"><a href="/luxury-villa-udaipur">Luxury villa</a><a href="/private-pool-villa-udaipur">Private pool villa</a><a href="/homestay-in-udaipur">Udaipur homestay</a></nav><span>Private homestay</span></footer>
    </main>
  );
}
