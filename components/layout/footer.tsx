import Link from 'next/link';
import FooterMenu from 'components/layout/footer-menu';
import LogoSquare from 'components/logo-square';
import { Menu } from 'lib/types';
import { Suspense } from 'react';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2025 + (currentYear > 2025 ? `-${currentYear}` : '');
  const skeleton = 'w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700';
  const menu: Menu[] = [
    { title: 'About Us', path: '/about' },
    { title: 'Contact', path: '/contact' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'FAQ', path: '/faq' },
    { title: 'Terms & Conditions', path: '/terms' },
    { title: 'Shipping & Return Policy', path: '/shipping-return' },
  ];
  const copyrightName = COMPANY_NAME || SITE_NAME || '';

  return (
    <footer className="w-full text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex w-full flex-1 justify-center">
              <ul className="grid grid-cols-1 gap-30 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <li key={index} className="flex flex-col gap-2">
                    <div className={skeleton} />
                    <div className={skeleton} />
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p className="px-[16px] lg:px-0">
            © {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith('.') ? '.' : ''} All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>
            <a
              href="mailto:crlapples19@gmail.com?subject=Wholesale%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black dark:text-white"
            >
              Wholesale
            </a>
          </p>
          <p className="md:ml-auto">
            <a
              href="https://crlapples.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black dark:text-white"
            >
              Created by crlapples
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}