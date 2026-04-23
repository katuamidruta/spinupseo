import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("packages")
    .select("id, name, slug, price_usd, links_count, dr_range, category")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
