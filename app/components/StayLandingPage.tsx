import Link from "next/link";

type StayLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  introduction: string;
  highlights: Array<{ title: string; copy: string }>;
  questions: Array<{ question: string; answer: string }>;
};

export default function StayLandingPage({ eyebrow, title, description, introduction, highlights, questions }: StayLandingPageProps) {
  return (
    <main className="seo-stay">
      <header className="seo-stay-nav">
        <Link href="/" className="seo-stay-brand">RUDRANSH <span>VILLA</span></Link>
        <Link href="/#contact" className="seo-stay-nav-cta">Check availability</Link>
      </header>

      <section className="seo-stay-hero">
        <div className="seo-stay-hero-art" aria-hidden="true" />
        <div className="seo-stay-hero-copy">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <p className="seo-stay-description">{description}</p>
          <Link href="/#contact" className="seo-stay-button">Send an enquiry <span>↗</span></Link>
        </div>
      </section>

      <section className="seo-stay-intro">
        <p className="seo-stay-label">Rudransh Villa</p>
        <h2>A stay with room<br />to slow <em>down.</em></h2>
        <p>{introduction}</p>
      </section>

      <section className="seo-stay-highlights" aria-label="Villa highlights">
        {highlights.map((highlight, index) => <article key={highlight.title}>
          <span>0{index + 1}</span>
          <h2>{highlight.title}</h2>
          <p>{highlight.copy}</p>
        </article>)}
      </section>

      <section className="seo-stay-faq">
        <p className="seo-stay-label">Planning your stay</p>
        <h2>Frequently asked<br /><em>questions.</em></h2>
        <div>
          {questions.map(({ question, answer }) => <details key={question}>
            <summary>{question}<span>+</span></summary>
            <p>{answer}</p>
          </details>)}
        </div>
        <Link href="/#contact" className="seo-stay-button">Ask about your dates <span>↗</span></Link>
      </section>

      <footer className="seo-stay-footer">
        <span>© Rudransh Villa · Udaipur, Rajasthan</span>
        <Link href="/">Return to Rudransh Villa</Link>
      </footer>
    </main>
  );
}
