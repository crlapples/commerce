import type { Metadata } from 'next';
import FAQContent from './FAQContent';
import Footer from 'components/layout/footer';

export const metadata: Metadata = {
  title: 'FAQ - [Your Company Name]',
  description: 'Frequently Asked Questions for [Your Company Name]',
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-between">
      <FAQContent />
      <Footer />
    </div>
  );
}