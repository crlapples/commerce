import Link from 'next/link';
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
  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products];

  return (
    <span className={`${styles.a} w-[1160vw] md:w-[548vw] flex gap-[12px]`}>
      <span className={`${styles.animateCarousel} w-[580vw] md:w-[274vw] flex overflow-x-scroll gap-[12px] px-1 pb-6 pt-1`}>
        <ul className={`flex overflow-x-hidden w-[290vw] md:w-[137vw] gap-[12px]`}>
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
                    currencyCode: 'USD' // Assuming USD currency based on your previous examples
                  }}
                  src={product.images[0] || '/placeholder-image.jpg'}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
        </ul>
        <ul className={`overflow-x-hidden flex w-[290vw] md:w-[137vw] gap-[12px]`}>
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
                    currencyCode: 'USD' // Assuming USD currency based on your previous examples
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
      <span className={`${styles.animateCarousel} w-[580vw] md:w-[274vw] flex overflow-x-scroll gap-[12px] px-1 pb-6 pt-1`}>
        <ul className={`flex w-[290vw] md:w-[137vw] gap-[12px] overflow-x-hidden`}>
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
                    currencyCode: 'USD' // Assuming USD currency based on your previous examples
                  }}
                  src={product.images[0] || '/placeholder-image.jpg'}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
        </ul>
        <ul className={`flex w-[290vw] md:w-[137vw] gap-[12px] overflow-x-hidden`}>
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
                    currencyCode: 'USD' // Assuming USD currency based on your previous examples
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
    </span>
  );
}