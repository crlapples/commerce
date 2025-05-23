import { ReadonlyURLSearchParams } from 'next/navigation';
import { Product, Variant } from './types';

export function normalizeVariants(product: Product): Product {
  // If no variants exist, create a default one
  if (!product.variant?.colors && !product.variant?.sizes) {
    return {
      ...product,
      variants: [{
        id: `${product.id}-default`,
        color: 'default',
        size: 'one-size',
        image: product.images[0]
      }]
    };
  }

  const colors = product.variant?.colors || ['default'];
  const sizes = product.variant?.sizes || ['one-size'];
  const variants: Variant[] = [];
  let variantIndex = 0;

  // Generate all possible color/size combinations
  colors.forEach(color => {
    sizes.forEach(size => {
      variants.push({
        id: `${product.id}-${variantIndex++}`,
        color,
        size,
        image: product.images[variantIndex % product.images.length] || product.images[0]
      });
    });
  });

  return {
    ...product,
    variants
  };
}

// Utility function to find a variant
export function findVariant(product: Product, color?: string, size?: string): Variant | undefined {
  if (!product.variants) return undefined;
  
  return product.variants.find(variant => 
    (!color || variant.color === color) && 
    (!size || variant.size === size)
  );
}

// Utility to get the default variant
export function getDefaultVariant(product: Product): Variant {
  if (product.variants && product.variants.length > 0) {
    return product.variants[0] || {
      id: `${product.id}-default`,
      color: 'default',
      size: 'one-size',
      image: product.images[0]
    };
  }
  
  return {
    id: `${product.id}-default`,
    color: 'default',
    size: 'one-size',
    image: product.images[0]
  };
}

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  // NOTE: this should eventually be replaced by a different mechanism
  //       for validating environment variables specific to YOUR local setup
  //       as the original check was for Shopify integration variables

  /*
  const requiredEnvironmentVariables = [
    'SHOPIFY_STORE_DOMAIN',
    'SHOPIFY_STOREFRONT_ACCESS_TOKEN'
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        '\n'
      )}\n`
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes('[') ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes(']')
  ) {
    throw new Error(
      'Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.'
    );
  }
  */
};

export function compareItems(a: string | number, b: string | number) {
  return a < b ? -1 : a > b ? 1 : 0;
}
