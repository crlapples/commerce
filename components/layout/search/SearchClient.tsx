'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Collections from './collections';
import { Product } from 'lib/types';
import { GridTileImage } from 'components/grid/tile';

const sortOptions = [
  { title: 'Relevance', slug: '', sortKey: 'RELEVANCE' },
  { title: 'Trending', slug: 'trending-desc', sortKey: 'TRENDING', reverse: true },
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true },
];

function ProductGridItem({ item }: { item: Product }) {
  return (
    <li className="aspect-square transition-opacity animate-fadeIn">
      <Link href={`/product/${item.id}`} className="relative inline-block h-full w-full">
        <GridTileImage
          src={item.images[0] || '/placeholder-image.jpg'}
          fill
          sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={item.name}
          label={{
            position: 'bottom',
            title: item.name,
            amount: item.price,
            currencyCode: 'USD',
          }}
        />
      </Link>
    </li>
  );
}

export default function SearchClient({
  initialProducts,
  initialQuery,
  initialSort,
  initialCollection,
}: {
  initialProducts: Product[];
  initialQuery: string;
  initialSort: string;
  initialCollection: string;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || initialQuery;
  const sort = searchParams.get('sort') || initialSort;
  const collection = searchParams.get('collection')?.toLowerCase() || initialCollection;
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let result = initialProducts;

    // Map products to collections (since products.json lacks collection field)
    result = result.map(product => ({
      ...product,
      collection: product.name.includes('Figure') ? 'Electronics' : product.name.includes('T-Shirt') ? 'Clothing' : 'Electronics',
    }));

    if (query) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    if (collection) {
      result = result.filter(product =>
        product.collection?.toLowerCase() === collection
      );
    }

    if (sort) {
      result = [...result].sort((a, b) => {
        if (sort === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
        if (sort === 'price-desc') return parseFloat(b.price) - parseFloat(b.price);
        if (sort === 'latest-desc') {
          const aId = a.id ? parseInt(a.id.toString(), 10) : 0;
          const bId = b.id ? parseInt(b.id.toString(), 10) : 0;
          return bId - aId;
        }
        if (sort === 'trending-desc') {
          // Placeholder: Sort by name as a proxy for trending
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    }

    setFilteredProducts(result);
  }, [query, sort, collection, initialProducts]);

  // Build base URL for sort links, preserving collection
  const basePath = collection ? `/search/${collection}` : '/search';

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      {/* Left Sidebar: Collections */}
      <div className="order-first w-full flex-none md:max-w-[125px]">
        <Collections />
      </div>

      {/* Main Content: Product Grid */}
      <div className="order-last min-h-screen w-full md:order-none">
        <p className="mb-4">
          Showing {filteredProducts.length} results for{' '}
          <span className="font-bold">"{query || collection || 'all'}"</span>
        </p>
        {filteredProducts.length === 0 ? (
          <p className="text-neutral-500">No products found.</p>
        ) : (
          <ul className="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {filteredProducts.map((product) => (
              <ProductGridItem key={product.id} item={product} />
            ))}
          </ul>
        )}
      </div>

      {/* Right Sidebar: Sort Options */}
      <div className="order-none flex-none md:order-last md:w-[125px]">
        <nav>
          <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">Sort by</h3>
          <ul className="hidden md:block">
            {sortOptions.map((option) => (
              <li key={option.slug} className="mt-2 flex text-sm text-black dark:text-white">
                <Link
                  href={`${basePath}${query ? `?q=${query}` : ''}${option.slug ? `${query ? '&' : '?'}sort=${option.slug}` : ''}`}
                  className="w-full hover:underline hover:underline-offset-4"
                  style={{ textDecoration: option.slug === sort ? 'underline' : 'none' }}
                >
                  {option.title}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="md:hidden">
            <div className="relative" ref={sortDropdownRef}>
              <button
                className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white/30"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <div>{sortOptions.find(opt => opt.slug === sort)?.title || 'Relevance'}</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                  className={`h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isSortOpen && (
                <ul className="absolute z-10 mt-1 w-full rounded border border-black/30 bg-white text-sm shadow-lg dark:border-white/30 dark:bg-black">
                  {sortOptions.map((option) => (
                    <li key={option.slug}>
                      <Link
                        href={`${basePath}${query ? `?q=${query}` : ''}${option.slug ? `${query ? '&' : '?'}sort=${option.slug}` : ''}`}
                        className="block px-4 py-2 text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                        onClick={() => setIsSortOpen(false)}
                      >
                        {option.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </div>
  );
}