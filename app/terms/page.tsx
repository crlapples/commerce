import Head from 'next/head';
import Footer from 'components/layout/footer'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>Terms and Conditions - ByteLoot, LLC</title>
        <meta name="description" content="Terms and Conditions for [Your Company Name]" />
      </Head>
      <div className="w-full bg-white dark:bg-black text-black dark:text-white shadow-lg rounded-lg py-3 px-8 md:py-8 md:px-30">
        <h1 className="text-3xl font-bold mb-4 text-center">Terms and Conditions</h1>
        <p className="text-sm text-gray-500 mb-2">Last Updated: May 20, 2025</p>
        <p className="mb-4">These Terms and Conditions ("Terms") govern your use of https://ingameshop.vercel.app and services provided by ByteLoot, LLC.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Our Website</h2>
        <p>You must be 18+ to use our website. Do not use it for unlawful purposes. We may restrict access at our discretion.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Products and Services</h2>
        <p>Product descriptions may contain errors. Prices may change, and we may limit quantities or cancel orders.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Payments</h2>
        <p>Payments are in USD via accepted methods. You authorize us to charge your payment method.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Intellectual Property</h2>
        <p>Website content is owned by ByteLoot, LLC and protected by copyright. Do not reproduce without permission.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
        <p>We are not liable for indirect damages. Liability is limited to the amount paid for the product.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Governing Law</h2>
        <p>These Terms are governed by Nevada, United States of America laws. Disputes are resolved in Nevada courts.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to These Terms</h2>
        <p>Updates will be posted here with a new "Last Updated" date.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
        <p>ByteLoot, LLC<br />crlapples19@gmail.com<br />1-385-227-1642<br />Las Vegas, NV</p>
      </div>
      <Footer />
    </div>
  );
}