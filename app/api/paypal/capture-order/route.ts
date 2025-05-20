import paypal from '@paypal/checkout-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Configure PayPal Environment
// Replace with your actual PayPal Client ID and Client Secret
const clientId = process.env.PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET

// Use SandboxEnvironment for testing and ProductionEnvironment for production
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: 'orderID is required' }, { status: 400 });
    }

    // Construct a request object and set desired parameters
    // Here we set the full-capture flag to true, which captures the total amount of the order.
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({}); // Sending an empty body is required for capture

    // Call API with your client and get a response for your call
    const response = await client.execute(request);

    if (response.statusCode !== 201) {
      console.error('Error capturing PayPal order:', response.statusCode, response.result);
      return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: response.statusCode });
    }

    return NextResponse.json(response.result);
  } catch (error) {
    console.error('Error processing PayPal capture request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}