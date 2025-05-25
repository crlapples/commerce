'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { useProduct, useUpdateURL } from 'components/product/product-context';
import Image from 'next/image';
import { Product } from 'lib/types';

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null = null; // Explicit type for timeout
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout!);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function Gallery({ images, product }: { images: { src: string; altText: string }[]; product: Product }) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const imageIndex = state.image ? parseInt(state.image, 10) : 0;
  const isColorSelected = !!state.color; // Check if a color is explicitly selected

  // Ensure imageIndex is valid
  const validImageIndex = Math.min(Math.max(imageIndex, 0), images.length - 1);
  const nextImageIndex = validImageIndex + 1 < images.length ? validImageIndex + 1 : 0;
  const previousImageIndex = validImageIndex === 0 ? images.length - 1 : validImageIndex - 1;

  // Memoize state properties to prevent unnecessary useEffect triggers
  const memoizedState = useMemo(() => ({
    image: state.image,
    color: state.color,
  }), [state.image, state.color]);

  // Debounced URL update
  const debouncedUpdateURL = useCallback(
    debounce((newState: { [key: string]: string }) => {
      updateURL(newState);
      console.log('Debounced URL update:', { image: validImageIndex, url: `?${new URLSearchParams(newState).toString()}` });
    }, 100),
    [updateURL, validImageIndex]
  );

  // Update URL to reflect validImageIndex
  useEffect(() => {
    const newState = { ...state, image: validImageIndex.toString() };
    // Only update if image has changed
    if (newState.image !== state.image) {
      debouncedUpdateURL(newState);
    }
  }, [validImageIndex, memoizedState, debouncedUpdateURL, state.image]);

  // Debug state changes
  useEffect(() => {
    console.log('Gallery state:', {
      image: state.image,
      color: state.color,
      imageIndex,
      validImageIndex,
      colors: product.variant?.colors,
    });
  }, [state.image, state.color, imageIndex, validImageIndex, product.variant?.colors]);

  const buttonClassName =
    'hover:cursor-pointer h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center';

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[validImageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[validImageIndex]?.altText ?? ''}
            src={images[validImageIndex]?.src ?? ''}
            priority={true}
          />
        )}

        {images.length > 1 && !isColorSelected ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                  console.log('Previous button:', { newImage: previousImageIndex });
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                  console.log('Next button:', { newImage: nextImageIndex });
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === validImageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                    console.log('Thumbnail click:', { newImage: index });
                  }}
                  aria-label="Select product image"
                  className="h-full w-full hover:cursor-pointer"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}