'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useOptimistic,
  use
} from 'react';
import { Cart, CartItem, Product } from 'lib/types';

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
  cart: Cart | undefined;
  updateCartItem: (productId: string, updateType: UpdateType, variant?: CartItem['variant']) => void;
  addCartItem: (product: Product, quantity: number, variant?: CartItem['variant']) => void;
  clearCart: () => void;
};

interface CartProviderProps {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  const itemPrice = parseFloat(price);
  return (isNaN(itemPrice) ? 0 : itemPrice * quantity).toFixed(2);
}

function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
  variant?: CartItem['variant']
): CartItem | null {
  if (variant && JSON.stringify(item.variant) !== JSON.stringify(variant)) {
    return item;
  }

  let newQuantity = item.quantity;
  if (updateType === 'plus') newQuantity++;
  else if (updateType === 'minus') newQuantity--;
  else if (updateType === 'delete') return null;

  return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
}

function createEmptyCart(): Cart {
  return { id: undefined, items: [], totalQuantity: 0, totalPrice: '0.00' };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case 'UPDATE_ITEM': {
      const { productId, updateType, variant } = action.payload;
      const updatedItems = currentCart.items
        .map(item => item.productId === productId ? updateCartItem(item, updateType, variant) : item)
        .filter(Boolean) as CartItem[];
      
      const nextCart = { ...currentCart, items: updatedItems };
      localStorage.setItem('cart', JSON.stringify(nextCart));
      return nextCart;
    }

    case 'ADD_ITEM': {
      const { product, quantity, variant } = action.payload;
      const existingItem = currentCart.items.find(
        item => item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      const updatedItem = existingItem
        ? { ...existingItem, quantity: existingItem.quantity + quantity }
        : { productId: product.id, quantity, variant };

      const updatedItems = existingItem
        ? currentCart.items.map(item => 
            item.productId === product.id && JSON.stringify(item.variant) === JSON.stringify(variant) 
              ? updatedItem 
              : item
          )
        : [...currentCart.items, updatedItem];

      const nextCart = { ...currentCart, items: updatedItems };
      localStorage.setItem('cart', JSON.stringify(nextCart));
      return nextCart;
    }

    case 'CLEAR_CART': {
      localStorage.removeItem('cart');
      return createEmptyCart();
    }

    default:
      return currentCart;
  }
}

export function CartProvider({ children, cartPromise }: CartProviderProps) {
  const initialCart = use(cartPromise);

  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const updateCartItem = (productId: string, updateType: UpdateType, variant?: CartItem['variant']) => {
    updateOptimisticCart({
      type: 'UPDATE_ITEM',
      payload: { productId, updateType, variant }
    });
  };

  const addCartItem = (product: Product, quantity: number, variant?: CartItem['variant']) => {
    updateOptimisticCart({
      type: 'ADD_ITEM',
      payload: { product, quantity, variant }
    });
  };

  const clearCart = () => {
    updateOptimisticCart({ type: 'CLEAR_CART' });
  };

  const value = useMemo(() => ({
    cart: optimisticCart,
    updateCartItem,
    addCartItem,
    clearCart
  }), [optimisticCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}