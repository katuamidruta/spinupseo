import { NextRequest, NextResponse } from "next/server";
import { PACKAGES } from "@/lib/paypal";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminNewOrder } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { packageSlug, targetUrl, keywords, notes, txHash, network } = await request.json();

  if (!txHash?.trim()) {
    return NextResponse.json({ error: "Transaction hash is required" }, { status: 400 });
  }

  const pkg = PACKAGES.find((p) => p.slug === packageSlug);
  if (!pkg) return NextResponse.json({ error: "Invalid package" }, { status: 400 });

  const { data: packageRow } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", packageSlug)
    .single();

  if (!packageRow) return NextResponse.json({ error: "Package not found" }, { status: 400 });

  // Create order with pending_verification status (admin must verify TX)
  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      package_id: packageRow.id,
      status: "pending_verification",
      payment_method: "usdt",
      payment_reference: txHash.trim(),
      payment_network: network,
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
      planName: `${pkg.name} [USDT - ${network} - verify TX: ${txHash.trim()}]`,
      targetUrl,
      orderId: order.id,
    }),
  ]);

  return NextResponse.json({ orderId: order.id });
}
