"use client";

import LogoSquare from 'components/logo-square';
import Link from 'next/link';
import { Suspense } from 'react';
import { Menu } from 'lib/types';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import dynamic from 'next/dynamic';
import OpenCart from 'components/cart/open-cart';

// Dynamically import CartModal
const CartModal = dynamic(() => import('components/cart/modal'), {
  ssr: false,
});

// Define SiteNameDiv as a regular component (no dynamic import)
const SiteNameDiv = ({ siteName }: { siteName: string | undefined }) => (
  <div className="ml-2 flex-none text-sm font-medium uppercase lg:block">
    {siteName} {/* Fallback to 'My Store' if undefined */}
  </div>
);

// Use environment variable with fallback
const SITE_NAME = process.env.SITE_NAME;

export function Navbar() {
  const menu: Menu[] = [
    { title: 'All', path: '/search' },
    { title: 'Figurines', path: '/search/figurines' },
    { title: 'Clothing', path: '/search/clothing' },
  ];

  // Debugging: Log SITE_NAME to verify its value
  console.log('SITE_NAME:', SITE_NAME);

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <SiteNameDiv siteName={SITE_NAME} />
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}