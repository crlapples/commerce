import Head from 'next/head';
import Footer from 'components/layout/footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen min-w-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center">
      <Head>
        <title>Privacy Policy - ByteLoot, LLC</title>
        <meta name="description" content="Privacy Policy for [Your Company Name]" />
      </Head>
      <div className="w-full bg-white dark:bg-black dark:text-white shadow-lg rounded-lg py-3 px-8 md:py-8 md:px-30">
        <h1 className="text-3xl font-bold mb-4 text-center">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-2">Last Updated: May 20, 2025</p>
        <p className="mb-4">ByteLoot, LLC ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website https://ingameshop.vercel.app or make a purchase from us.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p>We may collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Personal Information</strong>: Name, email address, phone number, billing and shipping addresses, and payment information.</li>
          <li><strong>Non-Personal Information</strong>: Browser type, IP address, device type, and browsing behavior via cookies.</li>
          <li><strong>Order Information</strong>: Details about products purchased and order history.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you, send promotions (with consent), improve our services, and comply with legal obligations.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing Your Information</h2>
        <p>We may share your information with service providers (e.g., payment processors, shipping companies) or as required by law. We do not sell your data for marketing purposes.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Cookies and Tracking</h2>
        <p>We may use cookies to enhance your experience and analyze traffic. Manage preferences via your browser.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
        <p>We use encryption and secure servers, but no internet transmission is 100% secure.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
        <p>You may have the right to access, correct, or delete your data, or opt out of marketing. Contact us at crlapples19@gmail.com.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Third-Party Links</h2>
        <p>We are not responsible for third-party site privacy practices.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to This Policy</h2>
        <p>Updates will be posted here with a new "Last Updated" date.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
        <p>ByteLoot, LLC<br />crlapples19@gmail.com<br />1-385-227-1642<br />Las Vegas, NV</p>
      </div>
      <Footer />
    </div>
  );
}