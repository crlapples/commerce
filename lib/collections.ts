import { Product } from './types';
import fs from 'fs/promises';
import path from 'path';

export async function getCollections() {
  const filePath = path.join(process.cwd(), 'lib', 'products.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const products: Product[] = JSON.parse(jsonData);

  const collections = Array.from(new Set(products.map(product => product.name))).map(
    (collection) => ({
      title: collection,
      path: `/search/${collection.toLowerCase()}`
    })
  );

  return collections.filter(collection => collection.title);
}