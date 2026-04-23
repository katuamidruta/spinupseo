import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import StatusBadge from "@/components/dashboard/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, packages(name)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const activeOrders = orders?.filter((o) => o.status !== "completed") ?? [];
  const completedOrders = orders?.filter((o) => o.status === "completed") ?? [];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Track your link building campaigns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{orders?.length ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-blue-600">{activeOrders.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedOrders.length}</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {!orders?.length ? (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto text-gray-300 mb-3" size={32} />
            <p className="text-sm text-gray-500">No orders yet</p>
            <Link href="/#pricing" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
              Browse plans →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Plan</th>
                <th className="px-6 py-3 text-left font-medium">Target URL</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {(order.packages as { name: string })?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-[180px] truncate">
                    {order.target_url}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/orders/${order.id}`} className="text-xs text-blue-600 hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link href="/#pricing" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
        <Package size={16} />
        New Order
      </Link>
    </div>
  );
}
