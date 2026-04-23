import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
import AdminOrderActions from "@/components/admin/order-actions";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, packages(name, links_min, links_max, dr_min), profiles(full_name)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const { data: report } = await supabase
    .from("reports")
    .select("*, report_items(*)")
    .eq("order_id", id)
    .single();

  const pkg = order.packages as { name: string; links_min: number; links_max: number; dr_min: number };
  const profile = order.profiles as { full_name: string };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">{pkg?.name} — {profile?.full_name}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-gray-400">Order {order.id} · {formatDate(order.created_at)}</p>
      </div>

      {/* Order details */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Target URL</p>
            <p className="text-gray-900 font-medium">{order.target_url}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Keywords</p>
            <p className="text-gray-900">{order.target_keywords || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Expected Links</p>
            <p className="text-gray-900">{pkg?.links_min}–{pkg?.links_max} (DR {pkg?.dr_min}+)</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Amount Paid</p>
            <p className="text-gray-900">${(order.amount_paid_cents / 100).toFixed(2)}</p>
          </div>
        </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
            <p className="text-gray-900 font-medium capitalize">
              {order.payment_method}
              {order.payment_network ? ` (${order.payment_network})` : ""}
            </p>
          </div>
          {order.payment_reference && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">
                {order.payment_method === "usdt" ? "TX Hash — verify on blockchain explorer" : "PayPal Capture ID"}
              </p>
              <code className="text-xs text-gray-700 bg-gray-50 rounded-lg px-3 py-2 block break-all">
                {order.payment_reference}
              </code>
              {order.payment_method === "usdt" && (
                <div className="flex gap-2 mt-1.5">
                  <a
                    href={`https://tronscan.org/#/transaction/${order.payment_reference}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Verify on TronScan →
                  </a>
                  <a
                    href={`https://etherscan.io/tx/${order.payment_reference}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Verify on Etherscan →
                  </a>
                </div>
              )}
            </div>
          )}
        {order.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Customer Notes</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Admin actions */}
      <AdminOrderActions order={order} report={report} />
    </div>
  );
}
