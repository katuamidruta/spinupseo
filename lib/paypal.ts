export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

const PAYPAL_BASE = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_SECRET!;
  const credentials = Buffer.from(`${clientId}:${secret}`).toString("base64");

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
        amount: {
          currency_code: "USD",
          value: (amountUSD / 100).toFixed(2),
        },
      }],
      application_context: {
        brand_name: "LinkForge",
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

export const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    slug: "starter",
    price: 4900,
    priceLabel: "$49",
    linksMin: 5,
    linksMax: 8,
    drMin: 30,
    description: "Establish your initial domain authority",
    features: [
      "5–8 editorial placements",
      "DR 30+ domains only",
      "Niche-relevant sites",
      "Monthly report",
      "Email support",
    ],
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth",
    slug: "growth",
    price: 14900,
    priceLabel: "$149",
    linksMin: 15,
    linksMax: 20,
    drMin: 40,
    description: "Accelerate your ranking momentum",
    features: [
      "15–20 editorial placements",
      "DR 40+ domains only",
      "Traffic-vetted sites (10k+/mo)",
      "Anchor text strategy",
      "Monthly report + metrics",
      "Priority support",
    ],
    highlight: true,
  },
  {
    id: "authority",
    name: "Authority",
    slug: "authority",
    price: 34900,
    priceLabel: "$349",
    linksMin: 35,
    linksMax: 50,
    drMin: 50,
    description: "Dominate your niche",
    features: [
      "35–50 editorial placements",
      "DR 50+ domains only",
      "High-traffic publications",
      "Full anchor strategy",
      "Competitor gap analysis",
      "Detailed monthly report",
      "Dedicated support",
    ],
    highlight: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    slug: "enterprise",
    price: 59900,
    priceLabel: "$599",
    linksMin: 60,
    linksMax: 100,
    drMin: 60,
    description: "White-glove, custom strategy",
    features: [
      "60–100 editorial placements",
      "DR 60+ premium domains",
      "Custom link strategy",
      "Quarterly SEO audit",
      "Weekly status updates",
      "Dedicated account manager",
    ],
    highlight: false,
  },
] as const;

export type Package = (typeof PACKAGES)[number];
