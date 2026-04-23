export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

const PAYPAL_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function createPayPalOrder(amountUSD: number, description: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        description,
        amount: { currency_code: "USD", value: (amountUSD / 100).toFixed(2) },
      }],
      application_context: {
        brand_name: "SpinupSEO",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
  });

  return res.json() as Promise<{ id: string; status: string }>;
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return res.json() as Promise<{
    id: string;
    status: string;
    purchase_units: { payments: { captures: { id: string; amount: { value: string } }[] } }[];
  }>;
}

// Category display config
export const CATEGORIES: Record<string, { label: string; color: string }> = {
  "pbn":         { label: "PBN Links",      color: "bg-purple-100 text-purple-700" },
  "contextual":  { label: "Contextual",     color: "bg-blue-100 text-blue-700" },
  "edu":         { label: "EDU Backlinks",  color: "bg-green-100 text-green-700" },
  "seo-package": { label: "SEO Package",    color: "bg-orange-100 text-orange-700" },
  "boost":       { label: "Authority Boost",color: "bg-rose-100 text-rose-700" },
  "general":     { label: "General",        color: "bg-gray-100 text-gray-700" },
};
