// components/product/product-description.tsx
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, Variant } from 'lib/types';

export function ProductDescription({
  product,
  onVariantChange,
}: {
  product: Product;
  onVariantChange?: (variant: Variant) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>({id: product.id, color: product.variant?.colors[0], size: product.variant?.sizes[0], image: product.images[0]});

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
      values: product.variant?.colors,
    },
    {
      id: 'size',
      name: 'Size',
      values: product.variant?.sizes,
    }
  ]

  console.log('Product:', product.name, 'Variants:', product.variant, 'Options:', options);

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mt-[8px] mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price} currencyCode="USD" />
        </div>
        {/* Variant Selectors */}
        {product.variant ? (
          <div className="mt-4 space-y-4">
            {options.map((option) => (
              <dl key={option.id} className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
                <dd className="flex flex-wrap gap-3">
                  {option.values?.map((value) => {
                    const isActive = selectedVariant[option.name as 'color' | 'size'] === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        title={`${option.name} ${value}`}
                        onClick={() => {
                          const newVariant = {
                            id: product.id,
                            color: option.name === "Color" ? value : selectedVariant.color,
                            size: option.name === "Size" ? value : selectedVariant.size,
                            image: product.images[product.variant?.colors?.indexOf(value)] ? product.images[product.variant?.colors?.indexOf(value)] : product.images[0]
                          };
                          if (typeof window !== undefined) {
                            window.globalColorIndex = product.variant?.colors?.indexOf(newVariant.color);
                          }
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