import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminNewOrder } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paypalOrderId, productSlug, targetUrl, keywords, notes } = await request.json();

  const capture = await capturePayPalOrder(paypalOrderId);
  if (capture.status !== "COMPLETED") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const { data: pkg } = await supabase
    .from("packages")
    .select("id, name, price_usd")
    .eq("slug", productSlug)
    .single();

  if (!pkg) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const captureId = capture.purchase_units[0]?.payments?.captures?.[0]?.id;

  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      package_id: pkg.id,
      status: "pending",
      payment_method: "paypal",
      payment_reference: captureId ?? paypalOrderId,
      amount_paid_cents: pkg.price_usd,
      target_url: targetUrl,
      target_keywords: keywords ?? "",
      notes: notes ?? "",
    })
    .select()
    .single();

  if (!order) return NextResponse.json({ error: "Failed to create order" }, { status: 500 });

  await Promise.allSettled([
    sendOrderConfirmation(user.email!, { planName: pkg.name, targetUrl, orderId: order.id }),
    sendAdminNewOrder({ userEmail: user.email!, planName: pkg.name, targetUrl, orderId: order.id }),
  ]);

  return NextResponse.json({ orderId: order.id });
}
