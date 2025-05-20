'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { SortFilterItem } from 'lib/constants';
import { Product } from 'lib/types';
import { GridTileImage } from 'components/grid/tile';
import products from 'lib/products.json';

const sortOptions: SortFilterItem[] = [
  { title: 'Relevance', slug: '', sortKey: 'RELEVANCE', reverse: false },
  { title: 'Price: Low to High', slug: 'price-asc', sortKey: 'PRICE', reverse: false },
  { title: 'Price: High to Low', slug: 'price-desc', sortKey: 'PRICE', reverse: true },
  { title: 'Newest', slug: 'newest', sortKey: 'CREATED_AT', reverse: true },
];

function ProductGridItem({ item }: { item: Product }) {
  return (
    <div className="relative block aspect-square w-full">
      <Link href={`/product/${item.id}`} prefetch={true}>
        <GridTileImage
          src={item.images[0] || '/placeholder-image.jpg'}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          alt={item.name}
          label={{
            position: 'bottom',
            title: item.name,
            amount: item.price,
            currencyCode: 'USD',
          }}
        />
      </Link>
    </div>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const sort = searchParams.get('sort') || '';
  const collection = searchParams.get('collection')?.toLowerCase() || '';
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    let result = products as Product[];

    if (query) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    if (collection) {
      result = result.filter(product =>
        product.name.toLowerCase() === collection
      );
    }

    if (sort) {
      result = [...result].sort((a, b) => {
        if (sort === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sort === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
        if (sort === 'newest') {
          const aId = a.id ? parseInt(a.id.toString(), 10) : 0;
          const bId = b.id ? parseInt(b.id.toString(), 10) : 0;
          return bId - aId; // Higher ID is newer
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [query, sort, collection]);

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {/* Mobile: Filters on top */}
          <div className="md:hidden">
            <FilterList list={sortOptions} title="Sort By" />
          </div>

          {/* Desktop/Tablet: Categories on left */}
          <div className="hidden md:block md:col-span-1">
            <Collections />
          </div>

          {/* Center: Product Grid */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="mb-4 text-xl font-semibold">
              {query ? `Results for "${query}"` : 'All Products'}
              {filteredProducts.length > 0 ? ` (${filteredProducts.length})` : ''}
            </h2>
            {filteredProducts.length === 0 ? (
              <p className="text-neutral-500">No products found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductGridItem key={product.id} item={product} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Filters on right */}
          <div className="hidden md:col-span-1 md:block">
            <FilterList list={sortOptions} title="Sort By" />
          </div>
        </div>
      </Suspense>
    </div>
  );
}