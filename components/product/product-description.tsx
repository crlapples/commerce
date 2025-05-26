'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { Product, Variant } from 'lib/types';
import { useProduct } from 'components/product/product-context';
import { useRouter, useSearchParams } from 'next/navigation';

export function ProductDescription({
  product,
  onVariantChange,
}: {
  product: Product;
  onVariantChange?: (variant: Variant) => void;
}) {
  const { updateImage, updateOption } = useProduct();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize selectedVariant with proper fallbacks
  const [selectedVariant, setSelectedVariant] = useState<Variant>({
    id: product.id,
    color: product.variant?.colors?.[0] || '',
    size: product.variant?.sizes?.[0] || '',
    image: product.images?.[0] || '', // Store image URL (string)
  });

  const handleVariantChange = (newVariant: Variant, colorIndex?: number) => {
    setSelectedVariant(newVariant);
    if (colorIndex !== undefined) {
      updateImage(colorIndex.toString()); // Update 0-based index in context
    }
    newVariant.color ? updateOption('color', newVariant.color) : updateOption('color', '');
    newVariant.size ? updateOption('size', newVariant.size) : updateOption('size', '');

    // Update URL params
    const current = new URLSearchParams();
    if (newVariant.color) {
      current.set('color', newVariant.color);
    }
    if (newVariant.size) {
      current.set('size', newVariant.size);
    }
    if (colorIndex !== undefined) {
      current.set('image', (colorIndex).toString()); // 1-based index for URL
    }
    const query = current.toString();
    router.replace(`?${query}`, { scroll: false });

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
                          const colorIndex = option.id === 'color' ? product.variant?.colors?.indexOf(value) ?? 0 : undefined;

                          const newVariant = {
                            ...selectedVariant,
                            [option.id]: value,
                            image:
                              option.id === 'color'
                                ? product.images[colorIndex ?? 0] || product.images[0] || ''
                                : selectedVariant.image,
                          };

                          handleVariantChange(newVariant, colorIndex);
                        }}
                        className={clsx(
                          'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                          {
                            'cursor-pointer ring-2 ring-blue-600': isActive,
                            'cursor-pointer ring-1 ring-transparent transition-[ring] duration-300 ease-in-out hover:ring-blue-600': !isActive,
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