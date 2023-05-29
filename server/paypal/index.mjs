import fetch from "node-fetch";

// set some important variables
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
const base = "https://api.sandbox.paypal.com";

export async function createPayout({ email, amount }) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/payments/payouts`;

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: "1524086406556",
        email_subject: "This email is related to simulation",
      },
      items: [
        {
          recipient_type: "EMAIL",
          receiver: email,
          note: "POSPYO001",
          sender_item_id: "15240864065560",
          amount: {
            currency: "USD",
            value: amount,
          },
        },
      ],
    }),
  });

  return handleResponse(response);
}

// generate access token
export async function generateAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString(
    "base64"
  );
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

// generate client token
export async function generateClientToken() {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${base}/v1/identity/generate-token`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.client_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}
