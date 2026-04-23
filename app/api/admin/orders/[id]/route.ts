import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendOrderProcessing } from "@/lib/resend";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status } = await request.json();

  const { data: order } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*, profiles(id)")
    .single();

  // Send processing email
  if (status === "processing" && order) {
    const { data: authUser } = await supabase.auth.admin.getUserById(
      (order.profiles as { id: string }).id
    );
    if (authUser.user?.email) {
      await sendOrderProcessing(authUser.user.email, id).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
