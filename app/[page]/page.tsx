import { notFound } from 'next/navigation'; // You can remove this import if not using notFound()

// notFound()

export default async function Page() {
  // Since we no longer fetch dynamic page data, always show "Page Not Found"
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
