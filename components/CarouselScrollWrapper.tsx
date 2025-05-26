'use client';

import { useRef, useEffect } from 'react';
import styles from './Carousel.module.css';

export default function CarouselScrollWrapper({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const maxAllowedScroll = maxScrollLeft * 0.25;

      // Clamp scroll to 0–25%
      if (el.scrollLeft > maxAllowedScroll) {
        el.scrollLeft = maxAllowedScroll;
      } else if (el.scrollLeft < 0) {
        el.scrollLeft = 0;
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollRef} className={styles.scrollContainer}>
      <div className={styles.carouselContent}>{children}</div>
    </div>
  );
}
