import { Suspense } from 'react';
import SearchClient from 'components/layout/search/SearchClient';
import { getProducts } from 'lib/data';

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { collection: string };
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const products = await getProducts();
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchClient
        initialProducts={products}
        initialQuery={resolvedSearchParams.q?.toString().toLowerCase() || ''}
        initialSort={resolvedSearchParams.sort?.toString() || ''}
        initialCollection={params.collection}
      />
    </Suspense>
  );
}