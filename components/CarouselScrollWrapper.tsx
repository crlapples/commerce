'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './Carousel.module.css';

export default function CarouselScrollWrapper({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [applyTransform, setApplyTransform] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollPercentage = scrollLeft / maxScroll;

      // Enable transform only if scrolled between 0% and 25%
      if (scrollPercentage <= 0.25) {
        setApplyTransform(true);
      } else {
        setApplyTransform(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className={`${styles.scrollContainer}`}
    >
      <div className={`${applyTransform ? styles.translatedFirstDiv : ''}`}>
        {children}
      </div>
    </div>
  );
}
