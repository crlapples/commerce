'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from './cart-context';
import { Product } from 'lib/types';

export function AddToCart({ product }: { product: Product }) {
  const { addCartItem } = useCart();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addCartItem(product, 1, product.variant);
      }}
    >
      <button
        type="submit"
        className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90 hover:cursor-pointer"
        aria-label="Add to cart"
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    </form>
  );
}