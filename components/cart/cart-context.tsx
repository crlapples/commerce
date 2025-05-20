'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem, Product } from 'lib/types';

type UpdateType = 'plus' | 'minus' | 'delete';

interface CartContextType {
  cart: Cart;
  updateCartItem: (productId: string, updateType: UpdateType, variant?: CartItem['variant']) => void;
  addCartItem: (product: Product, quantity: number, variant?: CartItem['variant']) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart
        ? JSON.parse(savedCart)
        : { items: [], totalQuantity: 0, totalPrice: '0.00' };
    }
    return { items: [], totalQuantity: 0, totalPrice: '0.00' };
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addCartItem = (product: Product, quantity: number = 1, variant?: CartItem['variant']) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = prevCart.items.map((item) =>
          item.productId === product.id &&
          JSON.stringify(item.variant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [
          ...prevCart.items,
          { productId: product.id, quantity, variant, price: Number(product.price) },
        ];
      }

      const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems
        .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
        .toFixed(2);

      return { items: updatedItems, totalQuantity, totalPrice };
    });
  };

  const updateCartItem = (
    productId: string,
    updateType: UpdateType,
    variant?: CartItem['variant']
  ) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items
        .map((item) => {
          if (
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
          ) {
            let newQuantity = item.quantity;
            if (updateType === 'plus') newQuantity++;
            if (updateType === 'minus') newQuantity--;
            if (updateType === 'delete' || newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);

      const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems
        .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
        .toFixed(2);

      return { items: updatedItems, totalQuantity, totalPrice };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalQuantity: 0, totalPrice: '0.00' });
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value: CartContextType = {
    cart,
    addCartItem,
    updateCartItem,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}