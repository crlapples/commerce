import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import fs from 'fs/promises';
import path from 'path';
import styles from './Carousel.module.css';

async function getProductsFromJson(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'lib', 'products.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export async function Carousel() {
  const toFilterProducts = await getProductsFromJson();
  const products = toFilterProducts.filter(product => Number(product.id) >= 4);
  if (!products || products.length === 0) return null;

  // Clone products for infinite illusion: [clone][original][clone]
  const carouselProducts = [...products];

  return (
    <div className={`${styles.scrollContainer} ${styles.animateCarousel} ${styles.a}`}>
      <div className={`${styles.carouselContent}`}>
        {[...carouselProducts, ...carouselProducts, ...carouselProducts].map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="relative aspect-square mx-[8px] h-[30vh] max-h-[275px] w-[66.66666vw] max-w-[475px] flex-none md:w-[33.33333vw]"
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
                imageClassName="ml-[25%] w-[75%]"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
