import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = "LinkForge <noreply@linkforge.io>";
const ADMIN = () => process.env.ADMIN_EMAIL!;

export async function sendOrderConfirmation(to: string, orderData: {
  planName: string;
  targetUrl: string;
  orderId: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "We received your order — LinkForge",
    html: `
      <h2>Your order is confirmed</h2>
      <p>Thanks for choosing LinkForge. We've received your <strong>${orderData.planName}</strong> order.</p>
      <p><strong>Target URL:</strong> ${orderData.targetUrl}</p>
      <p><strong>Order ID:</strong> ${orderData.orderId}</p>
      <p>We'll begin processing within 24 hours and keep you updated by email.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderData.orderId}">View your order →</a></p>
    `,
  });
}

export async function sendAdminNewOrder(orderData: {
  userEmail: string;
  planName: string;
  targetUrl: string;
  orderId: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN(),
    subject: `New order: ${orderData.planName} from ${orderData.userEmail}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Plan:</strong> ${orderData.planName}</p>
      <p><strong>Customer:</strong> ${orderData.userEmail}</p>
      <p><strong>Target URL:</strong> ${orderData.targetUrl}</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${orderData.orderId}">Process this order →</a></p>
    `,
  });
}

export async function sendOrderProcessing(to: string, orderId: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Your links are being built — LinkForge",
    html: `
      <h2>We're on it</h2>
      <p>Your link building campaign is now in progress. We're securing placements on vetted, high-authority domains.</p>
      <p>You'll receive your full report when delivery is complete.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}">Track your order →</a></p>
    `,
  });
}

export async function sendReportReady(to: string, orderId: string) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: "Your backlink report is ready — LinkForge",
    html: `
      <h2>Your report is ready</h2>
      <p>We've completed your link building campaign. Your backlinks are live and indexed.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}">View your full report →</a></p>
    `,
  });
}
