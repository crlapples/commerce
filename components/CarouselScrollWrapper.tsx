'use client';

import { useRef, useEffect } from 'react';
import styles from './Carousel.module.css';

export default function CarouselScrollWrapper({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let speed = 0.5; // Adjust scroll speed as needed

    const step = () => {
      if (!el) return;

      el.scrollLeft += speed;

      // Reset to start of original content seamlessly
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = el.scrollLeft - el.scrollWidth / 2;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div ref={scrollRef} className={styles.scrollContainer}>
      <div className={styles.carouselContent}>
        {children}
      </div>
    </div>
  );
}
