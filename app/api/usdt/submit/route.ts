import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminNewOrder } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productSlug, targetUrl, keywords, notes, txHash, network } = await request.json();

  if (!txHash?.trim()) return NextResponse.json({ error: "Transaction hash required" }, { status: 400 });

  const { data: pkg } = await supabase
    .from("packages")
    .select("id, name, price_usd")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .single();

  if (!pkg) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      package_id: pkg.id,
      status: "pending_verification",
      payment_method: "usdt",
      payment_reference: txHash.trim(),
      payment_network: network,
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
    sendAdminNewOrder({
      userEmail: user.email!,
      planName: `${pkg.name} [USDT ${network} — verify: ${txHash.trim()}]`,
      targetUrl,
      orderId: order.id,
    }),
  ]);

  return NextResponse.json({ orderId: order.id });
}
