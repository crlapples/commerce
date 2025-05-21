import Head from 'next/head';
import Footer from 'components/layout/footer'

export default function ShippingAndReturns() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>Shipping and Return Policy - [Your Company Name]</title>
        <meta name="description" content="Shipping and Return Policy for [Your Company Name]" />
      </Head>
      <div className="max-w-4xl w-full bg-white dark:bg-black text-black dark:text-white shadow-lg rounded-lg py-3 px-8 md:py-8 md:px-30">
        <h1 className="text-3xl font-bold mb-4 text-center">Shipping and Return Policy</h1>
        <p className="text-sm text-gray-500 mb-2">Last Updated: May 20, 2025</p>
        <p className="mb-4">This policy outlines shipping and return processes for [Your Company Name].</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Shipping</h2>
        <p>Orders are processed within 1-3 business days. We offer Standard and Expedited shipping via USPS, FedEx, and UPS. Delivery takes 1-14 days domestically, 7-60 days internationally. Costs are calculated at checkout. Customers pay customs fees. Tracking is provided.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Returns</h2>
        <p>Returns are accepted within 30 days for unused items. Contact crlapples19@gmail.com for authorization. Customers pay return shipping unless the item is defective.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Exchanges</h2>
        <p>Exchanges for defective/incorrect items are available within 30 days. Contact us to arrange.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Damaged or Incorrect Items</h2>
        <p>Contact us within 7 days with photos for replacements or refunds.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Non-Returnable Items</h2>
        <p>Personalized products, clearance items.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact Us</h2>
        <p>[Your Company Name]<br />crlapples19@gmail.com<br />[Your Contact Phone Number]<br />[Your Business Address]</p>
      </div>
      <Footer />
    </div>
  );
}