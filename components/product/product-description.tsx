'use client';

import { useState } from 'react';
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
  // Default to the first variant
  const [selectedVariant, setSelectedVariant] = useState<Variant>(getDefaultVariant(product));

  // Handle variant changes
  const handleVariantChange = (newVariant: Variant) => {
    setSelectedVariant(newVariant);
    if (onVariantChange) {
      onVariantChange(newVariant); // Trigger image update
    }
  };

  // Get unique colors and sizes
  const colors = Array.from(new Set(product.variants?.map((v) => v.color))) || ['default'];
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size).filter((s): s is string => !!s))) || ['one-size'];

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
        <div className="mt-[8px] mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price amount={product.price} currencyCode="USD" />
        </div>
        {/* Variant Selectors */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-4 space-y-4">
            {/* Color Selector */}
            {colors.length > 1 && (
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color
                </label>
                <select
                  id="color"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white sm:w-auto sm:text-sm"
                  value={selectedVariant.color}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    const newVariant = findVariant(product, newColor, selectedVariant.size);
                    if (newVariant) {
                      handleVariantChange(newVariant);
                    }
                  }}
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Size Selector */}
            {sizes.length > 1 && (
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Size
                </label>
                <select
                  id="size"
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white sm:w-auto sm:text-sm"
                  value={selectedVariant.size || 'one-size'}
                  onChange={(e) => {
                    const newSize = e.target.value;
                    const newVariant = findVariant(product, selectedVariant.color, newSize);
                    if (newVariant) {
                      handleVariantChange(newVariant);
                    }
                  }}
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
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