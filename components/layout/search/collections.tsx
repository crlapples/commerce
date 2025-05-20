'use client';

import clsx from 'clsx';
import FilterList from './filter';
import products from 'lib/products.json';
import { Product } from 'lib/types';

function CollectionList() {
  const collections = Array.from(new Set((products as Product[]).map(product => product.name))).map(
    (collection) => ({
      title: collection,
      path: `/search/${collection.toLowerCase()}`
    })
  );

  return <FilterList list={collections.filter(collection => collection.title)} title="Collections" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded-sm';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Collections() {
  return (
    <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
      <CollectionList />
    </div>
  );
}