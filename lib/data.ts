import products from './products.json';
import { Product } from './types';

export async function getProducts(): Promise<Product[]> {
  return products as Product[];
}