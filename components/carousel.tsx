'use client';

import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import { useEffect, useRef } from 'react';
import products from 'lib/products.json';
import './Carousel.module.css';

function CarouselContent({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;
    
    // Since we have duplicated content, the halfway point is where we reset
    const resetPoint = maxScroll / 2;

    let scrollPosition = 0;
    const scrollSpeed = 1.5; // Increased speed - pixels per frame

    const animate = () => {
      if (!isScrollingRef.current && container) {
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
      isScrollingRef.current = true;
      const currentScroll = container.scrollLeft;
      
      // If user scrolls forward past the reset point, jump back to beginning
      if (currentScroll >= resetPoint) {
        container.scrollLeft = 0;
        scrollPosition = 0;
      }
      // If user scrolls backward past the beginning, jump to the end of first set
      else if (currentScroll <= 0) {
        container.scrollLeft = resetPoint - 1;
        scrollPosition = resetPoint - 1;
      } else {
        scrollPosition = currentScroll;
      }
    };

    // Resume auto-scroll after manual scroll stops
    let scrollTimeout: NodeJS.Timeout;
    const handleScrollEnd = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000); // Resume after 1 second of no scrolling
    };

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('scroll', handleScrollEnd);
    
    // Pause on hover
    const handleMouseEnter = () => {
      isScrollingRef.current = true;
    };
    
    const handleMouseLeave = () => {
      isScrollingRef.current = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(scrollTimeout);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scroll', handleScrollEnd);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
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