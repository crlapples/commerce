'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Product } from 'lib/types';

// Define explicit collections based on product categories
const collections = [
  { title: 'All', path: '/search' },
  { title: 'Electronics', path: '/search/electronics' },
  { title: 'Accessories', path: '/search/accessories' },
];

export default function Collections() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav>
      <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">Collections</h3>
      <ul className="hidden md:block">
        {collections.map((collection) => (
          <li key={collection.path} className="mt-2 flex text-black dark:text-white">
            <Link
              href={collection.path}
              className="w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100"
              style={{ textDecoration: pathname === collection.path ? 'underline' : 'none' }}
            >
              {collection.title}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="md:hidden">
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white/30"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div>{collections.find(c => c.path === pathname)?.title || 'All'}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className={`h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {isOpen && (
            <ul className="absolute z-10 mt-1 w-full rounded border border-black/30 bg-white text-sm shadow-lg dark:border-white/30 dark:bg-black">
              {collections.map((collection) => (
                <li key={collection.path}>
                  <Link
                    href={collection.path}
                    className="block px-4 py-2 text-black hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ul>
    </nav>
  );
}