import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendReportReady } from "@/lib/resend";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { summary, items } = await request.json();

  // Upsert report
  const { data: report, error: reportError } = await supabase
    .from("reports")
    .upsert({ order_id: id, summary, delivered_at: new Date().toISOString() }, { onConflict: "order_id" })
    .select()
    .single();

  if (reportError || !report) {
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }

  // Delete existing items then re-insert
  await supabase.from("report_items").delete().eq("report_id", report.id);

  if (items?.length) {
    const rows = items.map((item: Record<string, unknown>) => ({ ...item, report_id: report.id }));
    await supabase.from("report_items").insert(rows);
  }

  // Mark order completed
  const { data: order } = await supabase
    .from("orders")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("user_id")
    .single();

  // Send email to user
  if (order) {
    const { data: authUser } = await supabase.auth.admin.getUserById(order.user_id);
    if (authUser.user?.email) {
      await sendReportReady(authUser.user.email, id).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
