'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, Variant } from 'lib/types';
import { useProduct, useUpdateURL } from 'components/product/product-context';

export function ProductDescription({
  product,
  onVariantChange,
}: {
  product: Product;
  onVariantChange?: (variant: Variant) => void;
}) {
  const { state, updateOption, updateImage } = useProduct();
  const updateURL = useUpdateURL();

  // Safely initialize selectedVariant with proper fallbacks
  const [selectedVariant, setSelectedVariant] = useState<Variant>({
    id: product.id,
    color: product.variant?.colors?.[0] || state.color || '',
    size: product.variant?.sizes?.[0] || state.size || '',
    image: product.images?.[0] || '',
  });

  const handleVariantChange = (newVariant: Variant, imageIndex: string) => {
    setSelectedVariant(newVariant);
    // Batch state updates
    const newState = {
      ...state,
      color: newVariant.color || '',
      size: newVariant.size || '',
      image: imageIndex,
    };
    updateImage(imageIndex); // Update image
    updateOption('color', newVariant.color as string); // Update color
    updateOption('size', newVariant.size as string); // Update size
    updateURL(newState); // Update URL with batched state
    onVariantChange?.(newVariant);
  };

  // Define options with safe access
  const options = [
    {
      id: 'color',
      name: 'Color',
      values: product.variant?.colors || [],
    },
    {
      id: 'size',
      name: 'Size',
      values: product.variant?.sizes || [],
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mt-[8px] mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price} currencyCode="USD" />
        </div>

        {product.variant ? (
          <div className="mt-4 space-y-4">
            {options.map((option) => (
              <dl key={option.id} className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
                <dd className="flex flex-wrap gap-3">
                  {option.values.map((value) => {
                    const isActive = selectedVariant[option.id as keyof Variant] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        title={`${option.name} ${value}`}
                        onClick={() => {
                          // Calculate the image index based on the color
                          const imageIndex =
                            option.id === 'color'
                              ? (product.variant?.colors?.indexOf(value) ?? 0).toString()
                              : selectedVariant.image;
                          const newVariant = {
                            ...selectedVariant,
                            [option.id]: value,
                            image:
                              option.id === 'color'
                                ? product.images[product.variant?.colors?.indexOf(value) ?? 0] ||
                                  product.images[0] ||
                                  ''
                                : selectedVariant.image,
                          };
                          handleVariantChange(newVariant, imageIndex as string);
                        }}
                        className={clsx(
                          'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                          {
                            'cursor-default ring-2 ring-blue-600': isActive,
                            'ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600': !isActive,
                          }
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </dd>
              </dl>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-sm text-gray-500 dark:text-neutral-400">No variants available</div>
        )}
      </div>

      {product.description && (
        <Prose className="mb-6 text-sm leading-tight dark:text-white/[60%]" html={product.description} />
      )}
      <AddToCart product={product} selectedVariant={selectedVariant} />
    </>
  );
}