'use client';

import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import styles from "./Carousel.module.css";
import { useEffect, useRef } from 'react';
import products from 'lib/products.json'

function CarouselContent({ products }: { products: Product[] }) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    const handleScroll = () => {
      const scrollLeft = span.scrollLeft;
      const scrollWidth = span.scrollWidth;
      const clientWidth = span.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      // Since we have two identical ul elements, the halfway point is where we reset
      const halfPoint = maxScroll / 2;
      
      // If scrolled past halfway point (end of first ul), jump back to start
      if (scrollLeft >= halfPoint) {
        span.scrollLeft = 0;
      }
      // If scrolled backwards past the start, jump to end of first ul
      else if (scrollLeft <= 0) {
        span.scrollLeft = halfPoint - 1;
      }
    };

    span.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      span.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <span 
      ref={spanRef}
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