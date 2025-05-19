import { MetadataRoute } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { Product } from 'lib/types'; // Assuming you have a Product type

async function getProductsFromJson(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'lib', 'products.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

// Assuming you have a way to get local collection slugs
async function getCollectionSlugs(): Promise<string[]> {
  // This is a placeholder - implement your logic to get collection slugs from your local data
  return ['shirts', 'shoes'];
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProductsFromJson();
  const collectionSlugs = await getCollectionSlugs();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`, // Use product.id or a slug
    lastModified: new Date() // Or a timestamp from your product data if available
  }));

  const collectionEntries: MetadataRoute.Sitemap = collectionSlugs.map((slug) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/search/${slug}`
  }));


  const routes = ['', '/search'].map((route) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}${route}`,
    lastModified: new Date()
  }));

  return [...routes, ...productEntries, ...collectionEntries];
}
