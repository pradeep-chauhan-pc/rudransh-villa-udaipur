"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionProps } from "framer-motion";
import GallerySlider from "./components/GallerySlider";
import SmoothScroll from "./components/SmoothScroll";

const WHATSAPP_NUMBER = "919251158345";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Rudransh Villa, I would like to check availability for my stay.")}`;

const faqs = [
  ["Is the entire villa private?", "Yes. Your group has the villa, pool, garden, and shared spaces to yourselves for the duration of the stay."],
  ["How many guests can stay?", "Share your preferred dates and guest count through the availability form. The villa team will confirm the best arrangement for your group."],
  ["What are the pool timings?", "The pool is available from 7:00 AM to 7:00 PM. Children must be supervised continuously by a responsible adult."],
  ["How do I check availability?", "Choose your dates and guest count in the form below. It opens WhatsApp with your details ready to send directly to the villa team."],
  ["Can I plan a celebration?", "Yes. Tell the team what you have in mind when you send your availability request so they can guide you on what is possible."],
];

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

const people = [
  ["Friends.", "Because the group chat finally became a plan."],
  ["Families.", "Because the best memories rarely happen according to schedule."],
  ["Couples.", "Because sometimes two people need an entire villa."],
  ["Celebrations.", "Birthdays, anniversaries, reunions—or absolutely no reason at all."],
];

const gallery: Array<readonly [string, string, string, string]> = [
  ["Poolside", "A private pool framed by warm evening light.", "/images/rudransh-villa-concept-hero.png", "villa-gallery-pool"],
  ["Garden", "A slower corner for tea, conversation, and open air.", "/images/rudransh-villa-concept-courtyard.png", "villa-gallery-garden"],
  ["Bedrooms", "Two calm rooms made for switching off properly.", "/images/rudransh-villa-room-concept.png", "villa-gallery-room"],
  ["Kitchen & dining", "The shared space for meals that take their time.", "/images/rudransh-villa-kitchen-concept.png", "villa-gallery-kitchen"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquiryState, setInquiryState] = useState<"idle" | "error">("idle");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const reducedMotion = useReducedMotion();
  const reveal: MotionProps = reducedMotion ? {} : { initial: { opacity: 0, y: 34 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.18 }, transition: { duration: 0.75, ease: "circOut" } };
  const { scrollYProgress } = useScroll();
  const pageProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
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
    const message = [
      "Hi Rudransh Villa, I would like to check availability.",
      `Name: ${formData.get("name")}`,
      `Mobile: ${formData.get("mobile")}`,
      `Guests: ${formData.get("guests")}`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      formData.get("message") ? `Message: ${formData.get("message")}` : "",
    ].filter(Boolean).join("\n");
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <main className="villa-site">
      <SmoothScroll />
      <motion.div className="villa-scroll-progress" style={{ scaleX: pageProgress }} aria-hidden="true" />
      <header className="villa-nav">
        <a className="villa-wordmark" href="#top" aria-label="Rudransh Villa home">
          <Image className="villa-logo" src="/rudransh-villa-logo.png" alt="" width={48} height={48} priority />
          <span>RUDRANSH <small>VILLA</small></span>
        </a>
        <button className="villa-menu" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav className={menuOpen ? "villa-links is-open" : "villa-links"} aria-label="Main navigation">
          <a href="#villa" onClick={() => setMenuOpen(false)}>The villa</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#beyond" onClick={() => setMenuOpen(false)}>The mood</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="villa-nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Enquire</a>
        </nav>
      </header>

      <section className="villa-hero" id="top">
        <motion.div className="villa-hero-art" aria-hidden="true" animate={reducedMotion ? undefined : { scale: [1, 1.045], x: [0, -12] }} transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}><i /><i /><i /></motion.div>
        <div className="villa-hero-copy">
          <motion.p className="villa-kicker" initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}>Rudransh Villa</motion.p>
          <h1><motion.span initial={reducedMotion ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>Your escape</motion.span><motion.span initial={reducedMotion ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>begins <em>here.</em></motion.span></h1>
          <motion.p className="villa-intro" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.82 }}>Sometimes you don&apos;t need another trip. You just need to disappear for a while.</motion.p>
          <motion.div className="villa-actions" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 1 }}>
            <a className="villa-button" href="#stay">Begin your stay <span>↓</span></a>
            <a className="villa-text-link" href="#contact">Check availability <span>↗</span></a>
          </motion.div>
        </div>
        <div className="villa-hero-note"><span>01</span><span>Begin the journey<br />beyond the usual</span></div>
      </section>

      <motion.section className="villa-manifesto" id="stay" {...reveal}>
        <p className="villa-kicker">Chapter one · Leave the ordinary</p>
        <div className="villa-split-heading">
          <h2>Leave the schedule.<br />Keep the people that <em>matter.</em></h2>
          <p>Leave the traffic. Leave the notifications. Keep the laughter, the long pauses and the people you came with.</p>
        </div>
        <div className="villa-marquee" aria-label="Private · Poolside · Unhurried">
          <span>PRIVATE</span><b>✦</b><span>POOLSIDE</span><b>✦</b><span>UNHURRIED</span><b>✦</b><span>TOGETHER</span><b>✦</b>
        </div>
      </motion.section>

      <motion.section className="villa-ordinary" {...reveal}>
        <p>WELCOME TO YOUR OWN LITTLE WORLD.</p>
        <div><span>NO CROWDED LOBBY</span><span>NO SHARED POOL</span><span>NO STRANGERS NEXT DOOR</span></div>
      </motion.section>

      <motion.section className="villa-arrival" {...reveal}>
        <div className="villa-arrival-image" aria-hidden="true" />
        <div className="villa-arrival-story"><p className="villa-kicker">A private arrival</p><span className="villa-chapter-number">01</span><h2>Let the day<br />open <em>slowly.</em></h2><p>Past the usual rush, a quieter world waits. It is a place to arrive without performing the holiday—just step in, exhale, and let the day unfold.</p></div>
      </motion.section>

      <motion.section className="villa-spaces" id="villa" aria-label="Inside Rudransh Villa" {...reveal}>
        <div className="villa-spaces-heading"><p className="villa-kicker">Inside Rudransh</p><h2>Every corner has<br />a part in the <em>story.</em></h2><p>From a calm room to the garden, pool and shared kitchen, the villa is made for a stay that unfolds naturally.</p></div>
        <div className="villa-space-grid">
          {villaSpaces.map(([number, title, copy, imageClass], index) => <motion.article className={`villa-space-card ${imageClass}`} key={title} initial={reducedMotion ? false : { opacity: 0, y: 44, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} whileHover={reducedMotion ? undefined : { y: -8 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75, delay: reducedMotion ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <div className="villa-space-image" aria-hidden="true" /><div className="villa-space-copy"><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>
          </motion.article>)}
        </div>
      </motion.section>

      <motion.section className="villa-gallery" id="gallery" aria-label="Rudransh Villa photo gallery" {...reveal}>
        <div className="villa-gallery-heading"><p className="villa-kicker">A closer look</p><h2>The villa, in<br /><em>every light.</em></h2><p>From the first swim to the last cup of tea, take a look around before you arrive.</p></div>
        <GallerySlider slides={gallery} />
      </motion.section>

      <motion.section className="villa-morning" {...reveal}>
        <div className="villa-morning-art" aria-hidden="true" />
        <div><p className="villa-kicker">Chapter four · Slow mornings</p><h2>Mornings without<br /><em>alarms.</em></h2><p>Wake up when you want. Make another cup. Stay in bed a little longer. Today has nowhere else to be.</p></div>
      </motion.section>

      <motion.section className="villa-city-story" ref={cityStoryRef} {...reveal}>
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
        <motion.div initial={reducedMotion ? false : { opacity: 0, x: -34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease: "circOut" }}><p className="villa-kicker">Final frame · Rudransh Villa</p><span className="villa-story-count">03 <i /> 03</span><h2>Slow afternoons.<br /><em>Still evenings.</em></h2><p>Enjoy the pool between 7 AM and 7 PM, settle into air-conditioned comfort, and let the villa be the part of the day that is entirely yours.</p><a className="villa-button" href="#contact">Start your story <span>↗</span></a></motion.div>
      </motion.section>

      <motion.section className="villa-time" id="experience" {...reveal}>
        <p className="villa-kicker">Golden hour to midnight</p>
        <h2>Some nights deserve<br />no <em>ending.</em></h2>
        <div className="villa-time-list">{[["4:37 PM", "Pool time."], ["6:21 PM", "Golden hour."], ["8:12 PM", "Dinner & conversations."], ["11:48 PM", "Nobody wants to sleep yet."]].map(([time, copy], index) => <motion.span key={time} initial={reducedMotion ? false : { opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.12, ease: "circOut" }}><b>{time}</b>{copy}</motion.span>)}</div>
      </motion.section>

      <motion.section className="villa-people" {...reveal}>
        <p className="villa-kicker">Who this place is for</p><h2>Come as you <em>are.</em></h2>
        <div>{people.map(([title, copy], index) => <motion.article key={title} whileHover={reducedMotion ? undefined : { y: -8 }} transition={{ duration: 0.25 }}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></motion.article>)}</div>
      </motion.section>

      <motion.section className="villa-udaipur" id="beyond" {...reveal}>
        <div><p className="villa-kicker">Beyond the villa</p><h2>Leave the noise behind.<br /><em>Keep the good parts.</em></h2><p>A full day can be as simple as water, sunlight, food, and the people you like most. Your return is somewhere quieter.</p></div>
        <ol><li>Wake slowly</li><li>Take a dip</li><li>Stay for sunset</li><li>Talk a little longer</li><li>Do it again tomorrow</li></ol>
      </motion.section>

      <motion.section className="villa-faq" id="faq" {...reveal}>
        <div><p className="villa-kicker">A few useful details</p><h2>Before you<br /><em>arrive.</em></h2><p>Everything you need to know before making the plan.</p></div>
        <div className="villa-faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>0{index + 1}</span>{question}<b>+</b></summary><p>{answer}</p></details>)}</div>
      </motion.section>

      <motion.section className="villa-contact" id="contact" {...reveal}>
        <p className="villa-kicker">The final chapter is yours</p>
        <h2>Bring your people.<br />We will hold the <em>moment.</em></h2>
        <p>Maybe it is a quiet family escape, a long-awaited reunion, or simply a few days with nowhere else to be. Tell us your dates and we will help shape the stay around you.</p>
        <form className="villa-inquiry-form" onSubmit={submitInquiry}>
          <label><span>Your name</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Full name" /></label>
          <label><span>Mobile number</span><input name="mobile" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9 +()\-]{10,15}" minLength={10} maxLength={15} required placeholder="10-digit mobile number" /></label>
          <label><span>Guests</span><select name="guests" defaultValue="2" required>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
          <label><span>Check-in</span><input name="checkIn" type="date" required /></label>
          <label><span>Check-out</span><input name="checkOut" type="date" required /></label>
          <label className="villa-inquiry-note"><span>Your note <em>optional</em></span><textarea name="message" rows={3} maxLength={1000} placeholder="Tell us what you have in mind" /></label>
          <button className="villa-inquiry-submit" type="submit">Check availability on WhatsApp <span aria-hidden="true">↗</span></button>
          {inquiryMessage && <p className={`villa-inquiry-status ${inquiryState}`} role="status">{inquiryMessage}</p>}
        </form>
        <a className="villa-whatsapp-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Chat on WhatsApp <span aria-hidden="true">↗</span></a>
      </motion.section>

      <footer className="villa-footer"><span>© Rudransh Villa</span><nav aria-label="Stay guides"><a href="/faq">FAQs</a><a href="/policies">Stay policies</a><a href="/luxury-villa-udaipur">Luxury villa</a><a href="/private-pool-villa-udaipur">Private pool villa</a><a href="/homestay-in-udaipur">Private homestay</a></nav><span>Private villa</span></footer>
    </main>
  );
}
