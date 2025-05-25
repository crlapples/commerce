import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { Product } from 'lib/types';
import fs from 'fs/promises';
import path from 'path';
import styles from './Carousel.module.css'; // Import the CSS module

async function getProductsFromJson(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'lib', 'products.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export async function Carousel() {
  const toFilterProducts = await getProductsFromJson();
  const products = toFilterProducts.filter(product => Number(product.id) < 4);
  console.log('Products:', products); // Debug to ensure products are loaded
  if (!products || products.length === 0) return null;
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className={styles.carouselContainer}>
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
    </div>
  );
}