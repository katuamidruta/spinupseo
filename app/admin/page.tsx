import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, packages(name), profiles(full_name)")
    .order("created_at", { ascending: false });

  const counts = {
    pending_verification: orders?.filter((o) => o.status === "pending_verification").length ?? 0,
    pending:    orders?.filter((o) => o.status === "pending").length ?? 0,
    processing: orders?.filter((o) => o.status === "processing").length ?? 0,
    completed:  orders?.filter((o) => o.status === "completed").length ?? 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Queue</h1>
        <p className="text-gray-500 text-sm mt-1">{orders?.length ?? 0} total orders</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-orange-200 rounded-xl p-5">
          <p className="text-xs text-orange-600 mb-1">Verify Payment</p>
          <p className="text-3xl font-bold text-orange-700">{counts.pending_verification}</p>
        </div>
        <div className="bg-white border border-yellow-200 rounded-xl p-5">
          <p className="text-xs text-yellow-600 mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">{counts.pending}</p>
        </div>
        <div className="bg-white border border-blue-200 rounded-xl p-5">
          <p className="text-xs text-blue-600 mb-1">Processing</p>
          <p className="text-3xl font-bold text-blue-700">{counts.processing}</p>
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-5">
          <p className="text-xs text-green-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-700">{counts.completed}</p>
        </div>
      </div>

      {/* Order table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Customer</th>
              <th className="px-6 py-3 text-left font-medium">Plan</th>
              <th className="px-6 py-3 text-left font-medium">Target URL</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
              <th className="px-6 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders?.map((order) => {
              const pkg = order.packages as { name: string };
              const profile = order.profiles as { full_name: string };
              return (
                <tr key={order.id} className={`hover:bg-gray-50 transition-colors ${order.status === "pending" ? "bg-yellow-50/30" : ""}`}>
                  <td className="px-6 py-4 text-sm text-gray-900">{profile?.full_name ?? "—"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pkg?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{order.target_url}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
                      Manage →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
