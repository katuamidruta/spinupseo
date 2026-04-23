import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder, PACKAGES } from "@/lib/paypal";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminNewOrder } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paypalOrderId, packageSlug, targetUrl, keywords, notes } = await request.json();

  const capture = await capturePayPalOrder(paypalOrderId);

  if (capture.status !== "COMPLETED") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  const pkg = PACKAGES.find((p) => p.slug === packageSlug);
  if (!pkg) return NextResponse.json({ error: "Invalid package" }, { status: 400 });

  const captureId = capture.purchase_units[0]?.payments?.captures?.[0]?.id;

  // Get package row
  const { data: packageRow } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .single();

  if (!packageRow) return NextResponse.json({ error: "Package not found" }, { status: 400 });

  // Create order
  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      package_id: packageRow.id,
      status: "pending",
      payment_method: "paypal",
      payment_reference: captureId ?? paypalOrderId,
      amount_paid_cents: pkg.price,
      target_url: targetUrl,
      target_keywords: keywords ?? "",
      notes: notes ?? "",
    })
    .select()
    .single();

  if (!order) return NextResponse.json({ error: "Failed to create order" }, { status: 500 });

  await Promise.allSettled([
    sendOrderConfirmation(user.email!, {
      planName: pkg.name,
      targetUrl,
      orderId: order.id,
    }),
    sendAdminNewOrder({
      userEmail: user.email!,
      planName: pkg.name,
      targetUrl,
      orderId: order.id,
    }),
  ]);

  return NextResponse.json({ orderId: order.id });
}
