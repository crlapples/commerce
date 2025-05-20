import { Suspense } from 'react';
import SearchClient from 'components/layout/search/SearchClient';
import { getProducts } from 'lib/data';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; collection?: string };
}) {
  const products = await getProducts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchClient
        initialProducts={products}
        initialQuery={searchParams.q?.toLowerCase() || ''}
        initialSort={searchParams.sort || ''}
        initialCollection={searchParams.collection?.toLowerCase() || ''}
      />
    </Suspense>
  );
}