'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CartItem } from 'lib/types';
import { useCart } from './cart-context';

export function DeleteItemButton({
  item,
  optimisticUpdate
}: {
  item: CartItem; // Keep using the new CartItem type
  optimisticUpdate: any;
}) {
  const { updateCartItem } = useCart();
  const itemId = item.productId; // Use productId from the new CartItem type

  return (
    <form
      action={() => {
        optimisticUpdate(itemId, 'delete'); // Use itemId
        updateCartItem(itemId, 'delete'); // Call updateCartItem with itemId and 'delete'
        console.log("delete clicked")
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500 hover:cursor-pointer"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {item.productId}
      </p>
    </form>
  );
}