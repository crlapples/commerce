import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { baseUrl } from 'lib/utils';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
};

// Inside RootLayout in app/layout.tsx
export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // The CartProvider itself handles reading from local storage,
  // but it still expects a promise prop. You can provide a promise
  // that resolves immediately, and the provider will use the local storage data.
  const initialCartPromise = Promise.resolve(undefined); // Provide an initially resolved promise

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        {/* Temporarily commented out for debugging */}
        {/* <CartProvider cartPromise={initialCartPromise}> */}
          {/* <Navbar /> */}
          <main>
            {children}
            {/* Temporarily commented out for debugging */}
            {/*
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>
      </body>
    </html>
  );
            */}
          </main>
        {/* </CartProvider> */}
      </body>
    </html>
  );
}

