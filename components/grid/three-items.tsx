import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/types';
import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

async function getProductsFromJson(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'lib', 'products.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

function ThreeItemGridItem({ item,
  size,
  priority
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.id}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.images[0] || '/placeholder-image.jpg'}
          fill
          sizes={
            size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'
          }
          priority={priority}
          alt={item.name}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.name,
            amount: item.price,
            currencyCode: 'USD' // Assuming USD currency based on your previous examples
          }}
        />
      </Link>
    </div>
  );
}
export async function ThreeItemGrid() {
  const homepageItems = await getProductsFromJson();

  // Filter out undefined values
  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
{/* Suggested code may be subject to a license. Learn more: ~LicenseLog:1198534044. */}
      {firstProduct && <ThreeItemGridItem size="full" item={firstProduct} priority={true} />}
      {secondProduct && <ThreeItemGridItem size="half" item={secondProduct} priority={true} />}
      {thirdProduct && <ThreeItemGridItem size="half" item={thirdProduct} />}
    </section>
  );
}
