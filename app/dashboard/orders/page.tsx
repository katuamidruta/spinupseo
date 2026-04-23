import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, packages(name, links_min, links_max)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders?.length ?? 0} total orders</p>
        </div>
        <Link href="/#pricing" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          New Order
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!orders?.length ? (
          <div className="py-16 text-center">
            <Package className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 text-sm">No orders yet</p>
            <Link href="/#pricing" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              Start your first campaign →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Plan</th>
                <th className="px-6 py-3 text-left font-medium">Target URL</th>
                <th className="px-6 py-3 text-left font-medium">Links</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const pkg = order.packages as { name: string; links_min: number; links_max: number };
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pkg?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{order.target_url}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {pkg?.links_min}–{pkg?.links_max}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/orders/${order.id}`} className="text-xs text-blue-600 hover:underline">
                        {order.status === "completed" ? "View Report →" : "View →"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
