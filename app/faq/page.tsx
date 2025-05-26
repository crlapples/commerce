import type { Metadata } from 'next';
import FAQContent from './FAQContent';
import Footer from 'components/layout/footer';

export const metadata: Metadata = {
  title: 'FAQ - In-Game Shop',
  description: 'Frequently Asked Questions for In-Game Shop',
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-between">
      <FAQContent />
      <Footer />
    </div>
  );
}