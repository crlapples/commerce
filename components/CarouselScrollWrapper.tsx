'use client';

import { useRef, useEffect } from 'react';
import styles from './Carousel.module.css';

export default function CarouselScrollWrapper({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const itemWidth = el.scrollWidth / 3; // Adjust if you clone more/less
    const originalScrollLeft = itemWidth;

    // Jump to the middle (start of original items)
    el.scrollLeft = originalScrollLeft;

    const handleScroll = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const minScrollLeft = 0;

      if (el.scrollLeft <= 0) {
        // Jump to original content from the start
        el.scrollLeft = originalScrollLeft;
      } else if (el.scrollLeft >= maxScrollLeft - itemWidth) {
        // Jump to original content from the end
        el.scrollLeft = originalScrollLeft;
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollRef} className={styles.scrollContainer}>
      <div className={styles.carouselContent}>
        {children}
      </div>
    </div>
  );
}
