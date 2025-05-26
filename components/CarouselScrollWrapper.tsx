'use client';

import { useRef, useEffect } from 'react';
import styles from './Carousel.module.css';

export default function CarouselScrollWrapper({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Delay until content is measured
    const handle = requestAnimationFrame(() => {
      const itemWidth = el.scrollWidth / 3;
      el.scrollLeft = itemWidth;
    });

    const handleScroll = () => {
      if (!el) return;
      const itemWidth = el.scrollWidth / 3;

      if (el.scrollLeft <= itemWidth * 0.1) {
        // Too far left, reset to middle
        el.scrollLeft += itemWidth;
      } else if (el.scrollLeft >= itemWidth * 1.9) {
        // Too far right, reset to middle
        el.scrollLeft -= itemWidth;
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => {
      cancelAnimationFrame(handle);
      el.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={scrollRef} className={`${styles.scrollContainer} ${styles.a}`}>
      <div className={styles.carouselContent}>
        {children}
        {children}
        {children}
      </div>
    </div>
  );
}
