// app/api/paypal/create-order/route.ts
import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';

// Initialize PayPal environment
function createClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  const environment = process.env.NODE_ENV === 'production'
    ? new paypal.core.PayPalEnvironment(
        clientId,
        clientSecret
      )
    : new paypal.core.SandboxEnvironment(
        clientId,
        clientSecret
      );

  return new paypal.core.PayPalHttpClient(environment);
}

export const dynamic = 'force-dynamic'; // Required for API routes that shouldn't be statically generated

export async function POST(request: Request) {
  const client = createClient();

  try {
    const { cartItems } = await request.json(); // Get cart data from request

    // Calculate order total from cart items
    const orderTotal = cartItems.reduce(
      (total: number, item: { price: number; quantity: number }) => 
        total + (item.price * item.quantity), 0
    ).toFixed(2);

    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer('return=representation');
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: orderTotal,
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: orderTotal
            }
          }
        },
        items: cartItems.map((item: { name: string; price: string; quantity: number }) => ({
          name: item.name,
          unit_amount: {
            currency_code: 'USD',
            value: item.price
          },
          quantity: item.quantity.toString()
        }))
      }]
    });

    const response = await client.execute(orderRequest);
    return NextResponse.json({ orderID: response.result.id });

  } catch (error) {
    console.error('PayPal order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}