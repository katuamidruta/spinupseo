import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder, PACKAGES } from "@/lib/paypal";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { packageSlug } = await request.json();
  const pkg = PACKAGES.find((p) => p.slug === packageSlug);
  if (!pkg) return NextResponse.json({ error: "Invalid package" }, { status: 400 });

  const order = await createPayPalOrder(pkg.price, `LinkForge ${pkg.name} Plan`);

  return NextResponse.json({ id: order.id });
}
