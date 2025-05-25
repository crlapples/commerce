'use client';

import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import { useEffect, useRef } from 'react';
import products from 'lib/products.json';
import './Carousel.module.css';

function CarouselContent({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isManualScrollingRef = useRef(false);
  const animationRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for container to be properly rendered
    setTimeout(() => {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      // Since we have duplicated content, the halfway point is where we reset
      const resetPoint = maxScroll / 2;

      let scrollPosition = 0;
      const scrollSpeed = 1; // pixels per frame

      const animate = () => {
        if (!isManualScrollingRef.current && container) {
          scrollPosition += scrollSpeed;
          
          // Reset position when we reach the halfway point (end of first set)
          if (scrollPosition >= resetPoint) {
            scrollPosition = 0;
          }
          
          container.scrollLeft = scrollPosition;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };

      // Start animation
      animationRef.current = requestAnimationFrame(animate);

      // Handle manual scrolling
      const handleScroll = () => {
        // Only handle if this is actually user interaction
        if (!isManualScrollingRef.current) {
          isManualScrollingRef.current = true;
        }

        const currentScroll = container.scrollLeft;
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // If user scrolls forward past the reset point, jump back to beginning
        if (currentScroll >= resetPoint) {
          container.scrollLeft = 0;
          scrollPosition = 0;
        }
        // If user scrolls backward past the beginning, jump to the end of first set
        else if (currentScroll <= 0 && scrollPosition > 0) {
          container.scrollLeft = resetPoint - 1;
          scrollPosition = resetPoint - 1;
        } else {
          scrollPosition = currentScroll;
        }

        // Resume auto-scroll after manual scroll stops
        scrollTimeoutRef.current = setTimeout(() => {
          isManualScrollingRef.current = false;
        }, 1500);
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      
      // Pause on hover
      const handleMouseEnter = () => {
        isManualScrollingRef.current = true;
      };
      
      const handleMouseLeave = () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isManualScrollingRef.current = false;
        }, 500);
      };

      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup function
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, 100);

  }, [products]);

  return (
    <div 
      ref={containerRef}
      className="flex overflow-x-scroll gap-[8px] mx-2 pb-6 pt-1 scrollbar-hide"
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* First set of products */}
      {products.map((product, i) => (
        <div
          key={`first-${product.id}-${i}`}
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
        </div>
      ))}
      
      {/* Duplicate set for infinite scroll */}
      {products.map((product, i) => (
        <div
          key={`second-${product.id}-${i}`}
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
        </div>
      ))}
    </div>
  );
}

export async function Carousel() {
  const toFilterProducts = products;
  const productsA = toFilterProducts.filter(product => Number(product.id) >= 4);
  
  if (!productsA || productsA.length === 0) return null;

  return <CarouselContent products={productsA} />;
}