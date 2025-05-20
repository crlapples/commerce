// app/api/paypal/create-order/route.ts
import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';

// Initialize PayPal environment
function createClient() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const client = createClient();

  try {
    const { cartItems } = await request.json();

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

    // Calculate order total from cart items
    const orderTotal = cartItems
      .reduce((total: number, item: { name: string; price: string; quantity: number }) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) {
          throw new Error(`Invalid price for item: ${item.name}`);
        }
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);

    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer('return=representation');
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: orderTotal,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: orderTotal,
              },
            },
          },
          items: cartItems.map(
            (item: { name: string; price: string; quantity: number }) => ({
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: parseFloat(item.price).toFixed(2),
              },
              quantity: item.quantity.toString(),
            })
          ),
        },
      ],
    });

    const response = await client.execute(orderRequest);
    return NextResponse.json({ orderID: response.result.id });
  } catch (error: any) {
    console.error('PayPal order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', message: error.message },
      { status: 500 }
    );
  }
}