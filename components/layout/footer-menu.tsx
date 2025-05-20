'use client';

import clsx from 'clsx';
import { Menu } from 'lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <Link
      href={item.path}
      className={clsx(
        'text-sm text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white underline-offset-4 hover:underline',
        {
          'text-black dark:text-neutral-300': active
        }
      )}
    >
      {item.title}
    </Link>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav className="flex w-full flex-1">
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {menu.reduce((columns: Menu[][], item, index) => {
          const columnIndex = Math.floor(index / 2);
          columns[columnIndex] = columns[columnIndex] || [];
          columns[columnIndex].push(item);
          return columns;
        }, []).map((column, index) => (
          <li key={index} className="flex flex-col gap-2">
            {column.map((item) => (
              <FooterMenuItem key={item.path} item={item} />
            ))}
          </li>
        ))}
      </ul>
    </nav>
  );
}