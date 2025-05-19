import { ImageResponse } from 'next/og';
// No import from 'lib/shopify'

export const runtime = 'edge';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      // ... generate a simpler image, perhaps just your logo
      <div>My Site Logo</div>
    ),
    // ... image options
  );
}
