"use client";

import { useState, useEffect } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer:
        'To place an order, browse our website [Your Website URL], select your desired products, add them to your cart, and proceed to checkout. You’ll need to provide your shipping and payment information. Once confirmed, you’ll receive an order confirmation email.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept payments in [Your Currency, e.g., USD] via major credit cards, PayPal, and other secure payment methods available at checkout. All transactions are processed securely.',
    },
    {
      question: 'How long will my order take to ship?',
      answer:
        'Orders are typically processed within [X-Y] business days. Shipping times depend on your location and chosen method: [Standard, Expedited] via [USPS, FedEx]. Domestic delivery takes [X-Y] days, and international delivery takes [X-Y] days. Tracking is provided.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within [30] days for unused, undamaged items in their original packaging. Contact crlapples19@gmail.com for a return authorization. Customers are responsible for return shipping costs unless the item is defective or incorrect.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Yes, we ship to [list countries or "select countries"]. International customers are responsible for customs fees, duties, or taxes. Shipping costs and estimated delivery times are calculated at checkout.',
    },
    {
      question: 'How can I contact customer support?',
      answer:
        'You can reach our customer support team at crlapples19@gmail.com or [Your Contact Phone Number]. We’re available [e.g., Monday–Friday, 9 AM–5 PM] to assist with any questions or concerns.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!isMounted) {
    return (
      <div className="max-w-4xl w-full bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-neutral-800 rounded-lg py-3 px-8 md:py-8 md:px-8 my-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 px-2 mb-6">Find answers to common questions about shopping with [Your Company Name].</p>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <div className="w-full flex justify-between items-center text-left text-lg font-semibold text-black dark:text-white p-2">
              <span>{faq.question}</span>
              <span className="text-xl">+</span>
            </div>
            <hr className="mt-2 border-gray-200 dark:border-neutral-800" />
          </div>
        ))}
        <p className="mt-6 text-sm">
          Still have questions? Contact us: {' '}
          <a href="mailto:crlapples19@gmail.com?subject=FAQ%20Query">
            <EnvelopeIcon className="h-5 w-5" />
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-neutral-800 rounded-lg py-3 px-8 md:py-8 md:px-8 my-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 px-2">Find answers to common questions about shopping with [Your Company Name].</p>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4">
          <button
            className="w-full flex justify-between items-center text-left text-lg font-semibold text-black dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <span>{faq.question}</span>
            <span className="text-xl">{openIndex === index ? '-' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="mt-2 text-gray-700 dark:text-gray-300 px-2">
              {faq.answer}
            </div>
          )}
          <hr className="mt-2 border-gray-200 dark:border-neutral-800" />
        </div>
      ))}
      <p className="mt-6 text-sm">
        Still have questions? Contact us:{' '}
        <a href="mailto:crlapples19@gmail.com?subject=FAQ%20Query">
            <EnvelopeIcon className="h-5 w-5" />
        </a>.
      </p>
    </div>
  );
}