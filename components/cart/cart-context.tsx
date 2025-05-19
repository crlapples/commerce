'use client';

import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic
} from 'react';
import { Cart, CartItem, Product } from 'lib/types'; // Assuming types are in lib/types.ts

type UpdateType = 'plus' | 'minus' | 'delete';

type CartAction =
  | {
      type: 'UPDATE_ITEM';
      payload: { productId: string; updateType: UpdateType; variant?: CartItem['variant'] };
    }
  | {
      type: 'ADD_ITEM';
      payload: { product: Product; quantity: number; variant?: CartItem['variant'] };
    }
  | {
      type: 'CLEAR_CART';
    };


type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
  updateCartItem: (productId: string, updateType: UpdateType, variant?: CartItem['variant']) => void;
  addCartItem: (product: Product, quantity: number, variant?: CartItem['variant']) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  const itemPrice = parseFloat(price);
  if (isNaN(itemPrice)) {
    console.error('Invalid price provided to calculateItemCost:', price);
    return '0.00';
  }
  return (itemPrice * quantity).toFixed(2);
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
  variant?: CartItem['variant']
): CartItem | null {
  if (variant && JSON.stringify(item.variant) !== JSON.stringify(variant)) {
    return item; // Only update items with matching variant
  }

  let newQuantity = item.quantity;
  if (updateType === 'plus') {
    newQuantity++;
  } else if (updateType === 'minus') {
    newQuantity--;
  } else if (updateType === 'delete') {
    return null; // Remove item
  }

  if (newQuantity <= 0) return null; // Remove if quantity is zero or less

  return { ...item, quantity: newQuantity };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  product: Product,
  quantity: number,
  variant?: CartItem['variant']
): CartItem {
  if (existingItem) {
    return {
      ...existingItem,
      quantity: existingItem.quantity + quantity,
    };
  } else {
    return {
      productId: product.id,
      quantity: quantity,
      variant: variant,
    };
  }
}

function updateCartTotals(
  items: CartItem[],
  allProducts: Product[] // Need all products to calculate total price
): Pick<Cart, 'totalQuantity' | 'totalPrice'> {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const product = allProducts.find(p => p.id === item.productId);
    if (!product) return sum;
    const itemPrice = parseFloat(product.price);
    if (isNaN(itemPrice)) return sum;
    return sum + itemPrice * item.quantity;
  }, 0).toFixed(2);

  return { totalQuantity, totalPrice };
}

function createEmptyCart(): Cart {
  return { id: undefined, items: [], totalQuantity: 0, totalPrice: '0.00' };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart { // allProducts is needed here too, but how to pass?
  let currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { productId, updateType, variant } = action.payload;
      const updatedItems = currentCart.items
        .map((item) =>
          item.productId === productId
            ? updateCartItem(item, updateType, variant)
            : item
        )
        .filter(Boolean) as CartItem[];

      const nextCart = {
        ...currentCart,
        items: updatedItems,
        // Totals will be updated after the reducer in useCart
      };
      localStorage.setItem('my-ecommerce-cart', JSON.stringify(nextCart));
      return nextCart;
    }
    case 'ADD_ITEM': {
      const { product, quantity, variant } = action.payload;
      const existingItem = currentCart.items.find(
        (item) => item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        product,
        quantity,
        variant
      );

      const updatedItems = existingItem
        ? currentCart.items.map((item) =>
            item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant) ? updatedItem : item
          )
        : [...currentCart.items, updatedItem];

      const nextCart = {
        ...currentCart,
        items: updatedItems,
        // Totals will be updated after the reducer in useCart
      };
      localStorage.setItem('my-ecommerce-cart', JSON.stringify(nextCart));
      return nextCart;
    }
    case 'CLEAR_CART': {
      localStorage.removeItem('my-ecommerce-cart');
      return createEmptyCart();
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  
  // OR, to be more explicit and handle potential parsing errors:
  
  let initialCart: Cart | undefined = undefined;
  const initialCartFromStorage = typeof window !== 'undefined' ? localStorage.getItem('my-ecommerce-cart') : null;
  
  if (initialCartFromStorage) {
    try {
      initialCart = JSON.parse(initialCartFromStorage);
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      // Optionally, clear invalid data from localStorage
      localStorage.removeItem('my-ecommerce-cart');
    }
  }  
    const { updateCartItem, addCartItem } = useCart(); // <-- Get functions from useCart

    return (
    <CartContext.Provider value={{
      cartPromise: Promise.resolve(initialCart),
      updateCartItem, // <-- Include updateCartItem
      addCartItem // <-- Include addCartItem
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const initialCart = use(context.cartPromise);
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: 'UPDATE_ITEM',
      payload: { productId: merchandiseId, updateType }
    });
  };

  const addCartItem = (product: Product, quantity: number, variant?: CartItem['variant']) => {
    updateOptimisticCart({ type: 'ADD_ITEM', payload: { product, quantity, variant } });
  };

  const clearCart = () => {
     updateOptimisticCart({ type: 'CLEAR_CART' });
  };

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
      clearCart, // Export clearCart
    }),
    [optimisticCart]
  );
}
