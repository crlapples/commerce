'use client'

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import products from 'lib/products.json';
import styles from "./Carousel.module.css";

export async function Carousel() {
  const toFilterProducts = products;
  const productsA = toFilterProducts.filter(product => Number(product.id) >= 4);
  if (!productsA || productsA.length === 0) return null;
  const carouselProducts = [...productsA]; // Single product list

  return (
    <CarouselClient carouselProducts={carouselProducts} />
  );
}

function CarouselClient({ carouselProducts }: { carouselProducts: Product[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const totalWidth = carousel.scrollWidth; // Width of the single product list
    let scrollPosition = 0; // Start at the beginning
    let animationFrame: number;

    // Set initial scroll position
    carousel.scrollTo({ left: scrollPosition, behavior: 'instant' });

    // Automatic scrolling
    const scrollSpeed = 2; // Pixels per frame
    const scroll = () => {
      scrollPosition += scrollSpeed;
      carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });

      // Reset to start when reaching the end
      if (scrollPosition >= totalWidth - 50) { // Buffer for early reset
        scrollPosition = 0;
        carousel.scrollTo({ left: scrollPosition, behavior: 'instant' });
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    // Start automatic scrolling
    animationFrame = requestAnimationFrame(scroll);

    // Handle manual scrolling
    const handleScroll = () => {
      scrollPosition = carousel.scrollLeft;

      // Reset to start when reaching the end
      if (scrollPosition >= totalWidth - 50) {
        scrollPosition = 0;
        carousel.scrollTo({ left: scrollPosition, behavior: 'instant' });
      }
      // Reset to end when reaching the start
      else if (scrollPosition <= 50) {
        scrollPosition = totalWidth - 50; // Start near the end
        carousel.scrollTo({ left: scrollPosition, behavior: 'instant' });
      }
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto px-1 pb-6 pt-1" ref={carouselRef}>
      <ul className={`${styles.animateCarousel} flex gap-4`}>
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.id}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
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
    </div>
  );
}