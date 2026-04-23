import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;
  return supabase;
}

export async function POST(request: NextRequest) {
  const supabase = await assertAdmin();
  if (!supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { data, error } = await supabase.from("packages").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
