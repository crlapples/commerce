import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import fs from 'fs/promises';
import path from 'path';
import styles from "./Carousel.module.css";

async function getProductsFromJson(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'lib', 'products.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export async function Carousel() {
  const toFilterProducts = await getProductsFromJson();
  const products = toFilterProducts.filter(product => Number(product.id) >= 4);
  if (!products || products.length === 0) return null;
  // Duplicate products for seamless looping
  const carouselProducts = [...products, ...products, ...products];

  return (
    <CarouselClient carouselProducts={carouselProducts} />
  );
}

function CarouselClient({ carouselProducts }: { carouselProducts: Product[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const totalWidth = carousel.scrollWidth;
    const singleSetWidth = totalWidth / 3; // Since we tripled the products
    let scrollPosition = singleSetWidth; // Start at the beginning of the second set
    let animationFrame: number;

    // Set initial scroll position to the second set for seamless looping
    carousel.scrollLeft = scrollPosition;

    // Automatic scrolling
    const scrollSpeed = 1; // Pixels per frame
    const scroll = () => {
      scrollPosition += scrollSpeed;
      carousel.scrollLeft = scrollPosition;

      // Seamless loop: reset to the second set when reaching the end
      if (scrollPosition >= singleSetWidth * 2) {
        scrollPosition = singleSetWidth;
        carousel.scrollLeft = scrollPosition;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    // Start automatic scrolling
    animationFrame = requestAnimationFrame(scroll);

    // Handle manual scrolling
    const handleScroll = () => {
      scrollPosition = carousel.scrollLeft;

      // Jump to second set when reaching the end
      if (scrollPosition >= singleSetWidth * 2) {
        carousel.scrollLeft = singleSetWidth;
        scrollPosition = singleSetWidth;
      }
      // Jump to second set when reaching the start
      else if (scrollPosition <= 0) {
        carousel.scrollLeft = singleSetWidth;
        scrollPosition = singleSetWidth;
      }
    };

    carousel.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1" ref={carouselRef}>
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