// components/product/product-description.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, Variant } from 'lib/types';
import { getDefaultVariant, findVariant } from 'lib/utils';

export function ProductDescription({
  product,
  onVariantChange,
}: {
  product: Product;
  onVariantChange?: (variant: Variant) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(getDefaultVariant(product));

  const handleVariantChange = (newVariant: Variant) => {
    console.log('Selected variant:', newVariant);
    setSelectedVariant(newVariant);
    if (onVariantChange) {
      onVariantChange(newVariant);
    }
  };

  // Define options for color and size
  const options = [
    {
      id: 'color',
      name: 'Color',
      values: Array.from(new Set(product.variants?.map((v) => v.color))) || ['default'],
    },
    {
      id: 'size',
      name: 'Size',
      values: Array.from(new Set(product.variants?.map((v) => v.size).filter((s): s is string => !!s))) || ['one-size'],
    },
  ].filter((option) => option.values.length > 0);

  console.log('Product:', product.name, 'Variants:', product.variants, 'Options:', options);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mt-[8px] mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price} currencyCode="USD" />
        </div>
        {/* Variant Selectors */}
        {product.variants && product.variants.length > 0 ? (
          <div className="mt-4 space-y-4">
            {options.map((option) => (
              <dl key={option.id} className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
                <dd className="flex flex-wrap gap-3">
                  {option.values.map((value) => {
                    const optionNameLowerCase = option.name.toLowerCase();
                    const isActive = selectedVariant[optionNameLowerCase as 'color' | 'size'] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        title={`${option.name} ${value}`}
                        onClick={() => {
                          const newVariant = findVariant(
                            product,
                            optionNameLowerCase === 'color' ? value : selectedVariant.color,
                            optionNameLowerCase === 'size' ? value : selectedVariant.size
                          );
                          handleVariantChange(newVariant); // findVariant always returns Variant
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
          <div className="mt-4 text-sm text-gray-500 dark:text-neutral-400">
            No variants available
          </div>
        )}
      </div>
      {product.description ? (
        <Prose className="mb-6 text-sm leading-tight dark:text-white/[60%]" html={product.description} />
      ) : null}
      <AddToCart product={product} selectedVariant={selectedVariant} />
    </>
  );
}