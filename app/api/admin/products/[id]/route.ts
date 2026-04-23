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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await assertAdmin();
  if (!supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { data, error } = await supabase
    .from("packages")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await assertAdmin();
  if (!supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await supabase.from("packages").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
