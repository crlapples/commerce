'use client';

import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import styles from "./Carousel.module.css";
import { useEffect, useRef } from 'react';
import products from 'lib/products.json'

function CarouselContent({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;
    
    // Since we have duplicated content, the halfway point is where we reset
    const resetPoint = maxScroll / 2;

    // Handle manual scrolling
    const handleScroll = () => {
      isScrollingRef.current = true;
      const currentScroll = container.scrollLeft;
      
      // If user scrolls past the reset point, jump back to beginning
      if (currentScroll >= resetPoint) {
        container.scrollLeft = 0;
      } else {
        // Keep track of scroll position for consistency
      }
    };

    // Resume auto-scroll after manual scroll stops
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); // Resume after 1 second of no scrolling
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('scroll', handleScrollEnd);

    return () => {
      clearTimeout(scrollTimeout);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scroll', handleScrollEnd);
    };
  }, [products]);

  return (
    <span 
      ref={containerRef}
      className={`${styles.a} w-[266.66666vw] md:w-[137vw] flex overflow-x-scroll gap-[8px] px-1 pb-6 pt-1`}
    >
      <ul className={`${styles.animateCarousel} flex w-full gap-[8px]`}>
        {products.map((product, i) => (
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
                  currencyCode: 'USD'
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
        {products.map((product, i) => (
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
                  currencyCode: 'USD'
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

export async function Carousel() {
  const toFilterProducts = products;
  const productsA = toFilterProducts.filter(product => Number(product.id) >= 4);
  if (!productsA || productsA.length === 0) return null;

  return <CarouselContent products={productsA} />;
}