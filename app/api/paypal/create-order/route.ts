import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productSlug } = await request.json();

  const { data: pkg } = await supabase
    .from("packages")
    .select("price_usd, name")
    .eq("slug", productSlug)
    .eq("is_active", true)
    .single();

  if (!pkg) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const order = await createPayPalOrder(pkg.price_usd, `SpinupSEO — ${pkg.name}`);
  return NextResponse.json({ id: order.id });
}
