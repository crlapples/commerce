import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import CarouselScrollWrapper from 'components/CarouselScrollWrapper';

export const metadata = {
  description:
    'High-performance video game themed ecommerce store built with Next.js, Vercel, and PayPal.',
  openGraph: {
    type: 'website',
    title: 'In-Game Shop',
    description:
      'Shop the best video game products with our high-performance ecommerce store built with Next.js, Vercel, and Shopify.',
    url: 'https://ingameshop.vercel.app', // Replace with your website URL
    images: [
      {
        url: 'https://ingameshop.vercel.app/ingameshop1.png', // Replace with the URL of your desired preview image
        width: 1200, // Recommended width for OpenGraph images
        height: 630, // Recommended height for OpenGraph images
        alt: 'Ecommerce Store Preview Image',
      },
    ],
    siteName: 'In-Game Shop',
  },
};

export default function HomePage() {
  return (
    <div className='overflow-x-hidden'>
      <ThreeItemGrid />
      <CarouselScrollWrapper>
        <Carousel />
      </CarouselScrollWrapper>
      <Footer />
    </div>
  );
}
