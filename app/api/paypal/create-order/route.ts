// app/api/paypal/create-order/route.ts
import paypal from '@paypal/checkout-server-sdk';
import { NextResponse } from 'next/server';

function createClient() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  console.log('PayPal Client ID (server):', clientId);
  console.log('PayPal Client Secret length (server):', clientSecret?.length || 'Missing');

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials: Client ID or Secret is not set');
  }

  // Log Base64-encoded credentials
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  console.log('Base64-encoded auth (client_id:client_secret):', auth);

  // Verify against curl's expected Base64
  const expectedAuth = 'QWRHMFNiRmQ0MDB5aDBzdDE4Y3NrWDdZSWgtTEQyaHEzZXNhaDBPZjdieFBRSjVPYUp0YVMtY1RNQTk2RGNKY0l2dndRR3zQbGN1amlYSEI6RUtHT19QXzVJcmlUQXFndFZaVWtzLTBVemQtd01BUDMxUHFQTWxUbkh1cUptODF3TlhRUzlOa3poWVZXNFpkR1Q5R2laNmlTVVhnbF9XdW0=';
  console.log('Base64 matches curl:', auth === expectedAuth);

  const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
  const client = new paypal.core.PayPalHttpClient(environment);

  console.log('PayPal API endpoint:', environment.baseUrl);

  return client;
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const client = createClient();

  try {
    const { cartItems } = await request.json();

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 });
    }

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

    console.log('Creating PayPal order with total:', orderTotal);
    const response = await client.execute(orderRequest);
    console.log('PayPal order created:', response.result.id);
    return NextResponse.json({ orderID: response.result.id });
  } catch (error: any) {
    console.error('PayPal order error:', error);
    const errorDetails = error.response
      ? {
          status: error.statusCode,
          message: error.message,
          response: error.response,
        }
      : { message: error.message };
    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error.message || 'Unknown error occurred',
        details: errorDetails,
      },
      { status: error.statusCode || 500 }
    );
  }
}