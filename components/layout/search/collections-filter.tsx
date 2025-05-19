'use client';

import FilterList from 'components/layout/search/filter';

interface Collection {
  title: string;
  path: string;
}

interface CollectionsFilterProps {
  collections: Collection[];
}

export default function CollectionsFilter({ collections }: CollectionsFilterProps) {
  return <FilterList list={collections} title="Collections" />;
}