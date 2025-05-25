'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import styles from './Carousel.module.css';
import products from 'lib/products.json'

export async function Carousel() {
  const toFilterProducts = products;
  const productsA = toFilterProducts.filter((product) => Number(product.id) >= 4);
  if (!productsA || productsA.length === 0) return null;

  const carouselProducts = [...productsA];
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  
    const carousels = container.querySelectorAll<HTMLElement>('ul');
  
    let isHovered = false;
    let count = 20;
  
    const resetAnimation = () => {
      carousels.forEach((ul) => {
        ul.style.animationDuration = '20s';
        ul.style.animationDirection = 'normal';
      });
      count = 20;
    };
  
    const handleScroll = (e: WheelEvent) => {
      if (!isHovered) return; // Only respond if hovered
  
      const isLeft = e.deltaY < 0 || e.deltaX < 0;
  
      carousels.forEach((ul) => {
        ul.style.animationDirection = isLeft ? 'reverse' : 'normal';
        count = Math.max(count - 0.01, 1)
        ul.style.animationDuration = `${count}s`;
      });
  
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        resetAnimation();
      }, 300); // 300ms after last scroll event resets animation
    };
  
    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
      resetAnimation();
    };
  
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('wheel', handleScroll);
  
    return () => {
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('wheel', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);  

  return (
    <span
      ref={containerRef}
      className={`${styles.a} w-[270vw] md:w-[137vw] flex overflow-x-hidden gap-[8px] px-1 pb-6 pt-1`}
    >
      <ul className={`${styles.animateCarousel} flex w-full gap-[8px]`}>
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.id}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-[66.66666vw] max-w-[475px] flex-none md:w-[33.33333vw]"
          >
            <Link href={`/product/${product.id}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name,
                  amount: product.price,
                  currencyCode: 'USD',
                }}
                src={product.images[0] || '/placeholder-image.jpg'}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
      <ul className={`${styles.animateCarousel} flex w-full gap-[8px]`}>
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.id}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-[66.66666vw] max-w-[475px] flex-none md:w-[33.33333vw]"
          >
            <Link href={`/product/${product.id}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.name}
                label={{
                  title: product.name,
                  amount: product.price,
                  currencyCode: 'USD',
                }}
                src={product.images[0] || '/placeholder-image.jpg'}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </span>
  );
}
