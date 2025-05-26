'use client';

import clsx from 'clsx';
import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import Price from 'components/price';
import { createUrl } from 'lib/utils';
import { Product, CartItem } from 'lib/types';
import products from 'lib/products.json'

type PayPalButtonColor = 'black' | 'white' | 'gold' | 'blue' | 'silver';

// Ensure PAYPAL_CLIENT_ID is set
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

if (process.env.NODE_ENV !== 'production' && !paypalClientId) {
  throw new Error('PAYPAL_CLIENT_ID environment variable is not set.');
}

async function getProductsFromJson(): Promise<Product[]> {
  try {
    const res = products as Product[];
    if (!res) {
      throw new Error(`Failed to fetch products: ${res}`);
    }
    return res;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default function CartModal() {
  const { cart, updateCartItem, clearCart, isCartOpen, openCart, closeCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [colorScheme, setColorScheme] = useState<PayPalButtonColor>('white');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mediaQuery.matches ? 'blue' : 'white');
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'blue' : 'white');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    getProductsFromJson().then(setProducts);
  }, []);

  function CloseCart({ className }: { className?: string }) {
    return (
      <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
        <XMarkIcon
          className={clsx('h-6 transition-all ease-in-out hover:scale-110', className)}
          onClick={(e) => {
            e.stopPropagation();
            closeCart();
          }}
        />
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: `${paypalClientId}`, currency: "USD", intent: "capture", 'data-sdk-url': 'https://www.sandbox.paypal.com/sdk/js', }}>
      <button aria-label="Open cart" onClick={openCart} className="hover:cursor-pointer">
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isCartOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-700 dark:bg-black/80 dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {!cart || cart.items.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between p-1 overflow-y-scroll">
                  <ul className="grow overflow-visible py-4">
                    {cart.items.map((item, i) => {
                      const product = products.find((p) => p.id === item.productId);
                      if (!product) return null;

                      const merchandiseUrl = createUrl(
                        `/product/${product.id}`,
                        new URLSearchParams(item.variant?.color ? { color: item.variant.color } : {})
                      );

                      // Build variant text for display
                      const variantText = [];
                      if (item.variant?.color) {
                        variantText.push(`Color: ${item.variant.color}`);
                      }
                      if (item.variant?.size) {
                        variantText.push(`Size: ${item.variant.size}`);
                      }

                      return (
                        <li
                          key={`${item.productId}-${JSON.stringify(item.variant)}-${i}`}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -ml-2 -mt-2">
                              <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
                            </div>
                            <div className="flex flex-row">
                              <div className="relative h-fit overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900">
                                <Image
                                  className="object-cover"
                                  width={64}
                                  height={64}
                                  alt={item.variant?.color ? `${product.name} - ${item.variant.color}` : product.name}
                                  src={item.variant?.image || product.images[0] || '/placeholder-image.jpg'}
                                />
                              </div>
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="z-30 ml-2 flex flex-row space-x-4"
                              >
                                <div className="flex flex-1 flex-col text-base">
                                  <span className="leading-tight">{product.name}</span>
                                  {variantText.length > 0 && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                      {variantText.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </div>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={product.price.toString()}
                                currencyCode="USD"
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  optimisticUpdate={updateCartItem}
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p>Taxes</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={String(Number(cart.totalPrice) * 0.08)}
                        currencyCode="USD"
                      />
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Shipping</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p>Total</p>
                      <Price
                        className="text-right text-base text-black dark:text-white"
                        amount={String(cart.totalPrice)}
                        currencyCode="USD"
                      />
                    </div>
                  </div>
                  <div className="mt-4 dark:py-3 dark:px-2 dark:rounded-[3px] dark:bg-white">
                    <PayPalButtons
                      style={{
                        layout: 'vertical',
                        color: colorScheme,
                        shape: 'rect',
                        label: 'checkout',
                        tagline: false
                      }}
                      createOrder={async () => {
                        try {
                          const orderItems = cart.items
                            .map((item) => {
                              const product = products.find((p) => p.id === item.productId);
                              if (!product) return null;
                              const variantDescription = [
                                item.variant?.color ? `${item.variant.color}` : '',
                                item.variant?.size ? `${item.variant.size}` : ''
                              ]
                                .filter(Boolean)
                                .join(', ');
                              return {
                                name: product.name,
                                description: variantDescription || undefined,
                                sku: `${product.id}-${item.variant?.color || 'default'}-${item.variant?.size || 'default'}`,
                                unit_amount: {
                                  currency_code: 'USD',
                                  value: Number(product.price).toFixed(2)
                                },
                                quantity: item.quantity.toString(),
                                custom_id: item.variant?.image || undefined
                              };
                            })
                            .filter((item): item is NonNullable<typeof item> => item !== null);
                      
                          const response = await fetch('/api/paypal/create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              cartItems: orderItems,
                              total: Number(cart.totalPrice).toFixed(2)
                            })
                          });
                      
                          if (!response.ok) {
                            throw new Error(`Failed to create PayPal order: ${response.statusText}`);
                          }
                      
                          const order = await response.json();
                          if (!order.orderID) {
                            throw new Error('No order ID returned from PayPal');
                          }
                      
                          console.log('PayPal order created:', order);
                          return order.orderID;
                        } catch (error) {
                          console.error('Error in createOrder:', error);
                          throw error;
                        }
                      }}
                      onApprove={async (data) => {
                        try {
                          const response = await fetch('/api/paypal/capture', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderID: data.orderID })
                          });
                      
                          if (!response.ok) {
                            throw new Error(`Failed to capture PayPal order: ${response.statusText}`);
                          }
                      
                          const details = await response.json();
                          console.log('Payment captured', details);
                          alert(`Transaction completed by ${details.details.payer.name.given_name}. You will be emailed with the tracking number soon.`);
                          clearCart();
                          closeCart();
                        } catch (error) {
                          console.error('Error in onApprove:', error);
                          alert('Failed to capture payment. Please try again.');
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </PayPalScriptProvider>
  );
}