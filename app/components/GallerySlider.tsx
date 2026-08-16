"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

type Slide = readonly [title: string, copy: string, src: string, className: string];

export default function GallerySlider({ slides }: { slides: readonly Slide[] }) {
  const [viewportRef, embla] = useEmblaCarousel({ align: "start", loop: true, skipSnaps: false });

  return <div className="villa-gallery-slider">
    <div className="villa-gallery-viewport" ref={viewportRef}>
      <div className="villa-gallery-track">
        {slides.map(([title, copy, src, className], index) => <figure className={`villa-gallery-card ${className}`} key={title}>
          <Image src={src} alt={`${title} at Rudransh Villa`} fill sizes="(max-width: 720px) 86vw, 66vw" />
          <figcaption><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></figcaption>
        </figure>)}
      </div>
    </div>
    <div className="villa-gallery-controls">
      <p>Swipe to explore <span aria-hidden="true">→</span></p>
      <div><button type="button" onClick={() => embla?.scrollPrev()} aria-label="Previous gallery image">←</button><button type="button" onClick={() => embla?.scrollNext()} aria-label="Next gallery image">→</button></div>
    </div>
  </div>;
}
