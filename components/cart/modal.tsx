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

// Ensure PAYPAL_CLIENT_ID is set
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

if (process.env.NODE_ENV !== 'production' && !paypalClientId) {
  throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID environment variable is not set.');
}

async function getProductsFromJson(): Promise<Product[]> {
  try {
    const res = await fetch('/products.json');
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    const products = await res.json();
    return products as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default function CartModal() {
  const { cart, updateCartItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsFromJson().then(setProducts);
  }, []);

  useEffect(() => {
    if (cart?.totalQuantity && cart.totalQuantity > 0 && !isOpen) {
      setIsOpen(true);
    }
  }, [cart?.totalQuantity, isOpen]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId as string }}>
      <button aria-label="Open cart" onClick={openCart} className="hover:cursor-pointer">
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
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
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="grow overflow-auto py-4">
                    {cart.items.map((item, i) => {
                      const product = products.find((p) => p.id === item.productId);
                      if (!product) return null;

                      const merchandiseUrl = createUrl(
                        `/product/${product.id}`,
                        new URLSearchParams(item.variant?.color ? { color: item.variant.color } : {})
                      );

                      return (
                        <li
                          key={`${item.productId}-${JSON.stringify(item.variant)}-${i}`}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -ml-1 -mt-2">
                              <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
                            </div>
                            <div className="flex flex-row">
                              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={product.name}
                                  src={product.images[0] || '/placeholder-image.jpg'}
                                />
                              </div>
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="z-30 ml-2 flex flex-row space-x-4"
                              >
                                <div className="flex flex-1 flex-col text-base">
                                  <span className="leading-tight">{product.name}</span>
                                  {item.variant?.color ? (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                      Color: {item.variant.color}
                                    </p>
                                  ) : null}
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
                  <div className="mt-4">
                    <PayPalButtons
                      createOrder={async () => {
                        const orderItems = cart.items
                          .map((item) => {
                            const product = products.find((p) => p.id === item.productId);
                            if (!product) return null;
                            return {
                              productId: item.productId,
                              quantity: item.quantity,
                              variant: item.variant,
                              price: product.price,
                              name: product.name,
                            };
                          })
                          .filter((item): item is NonNullable<typeof item> => item !== null);

                        const response = await fetch('/api/paypal/create-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ items: orderItems, totalAmount: cart.totalPrice }),
                        });
                        const order = await response.json();
                        return order.id;
                      }}
                      onApprove={async (data) => {
                        const response = await fetch('/api/paypal/capture-order', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ orderID: data.orderID }),
                        });
                        const details = await response.json();
                        console.log('Payment captured', details);
                        alert(`Transaction completed by ${details.payer.name.given_name}`);
                        clearCart();
                        closeCart();
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

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <XMarkIcon
        className={clsx('h-6 transition-all ease-in-out hover:scale-110', className)}
      />
    </div>
  );
}