import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Clock, CheckCircle2 } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select("*, packages(name, links_min, links_max, dr_min)")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!order) notFound();

  const { data: report } = await supabase
    .from("reports")
    .select("*, report_items(*)")
    .eq("order_id", id)
    .single();

  const pkg = order.packages as { name: string; links_min: number; links_max: number; dr_min: number };

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold text-gray-900">{pkg?.name} Plan</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-gray-500">Order placed {formatDate(order.created_at)}</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Target URL</p>
          <p className="text-sm font-medium text-gray-900 truncate">{order.target_url}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Keywords</p>
          <p className="text-sm font-medium text-gray-900 truncate">{order.target_keywords || "—"}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Expected Links</p>
          <p className="text-sm font-medium text-gray-900">{pkg?.links_min}–{pkg?.links_max} (DR {pkg?.dr_min}+)</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-5">Order Progress</h2>
        <div className="space-y-4">
          {[
            { label: "Order Received", done: true, date: formatDate(order.created_at) },
            { label: "Campaign Started", done: order.status === "processing" || order.status === "completed", date: "" },
            { label: "Report Delivered", done: order.status === "completed", date: report?.delivered_at ? formatDate(report.delivered_at) : "" },
          ].map(({ label, done, date }) => (
            <div key={label} className="flex items-center gap-3">
              {done
                ? <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                : <Clock size={18} className="text-gray-300 flex-shrink-0" />
              }
              <span className={`text-sm ${done ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
              {date && <span className="text-xs text-gray-400 ml-auto">{date}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Report */}
      {order.status !== "completed" ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <Clock className="mx-auto text-blue-400 mb-3" size={32} />
          <p className="text-sm font-medium text-blue-900">Your report is being prepared</p>
          <p className="text-xs text-blue-600 mt-1">We&apos;ll notify you by email when it&apos;s ready</p>
        </div>
      ) : report ? (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Backlink Report</h2>
            <span className="text-xs text-gray-500">{report.report_items?.length ?? 0} placements delivered</span>
          </div>
          {report.summary && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs text-gray-600">
              {report.summary}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Domain</th>
                  <th className="px-6 py-3 text-left font-medium">DR</th>
                  <th className="px-6 py-3 text-left font-medium">Anchor Text</th>
                  <th className="px-6 py-3 text-left font-medium">Type</th>
                  <th className="px-6 py-3 text-left font-medium">Date Live</th>
                  <th className="px-6 py-3 text-left font-medium">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {report.report_items?.map((item: {
                  id: string;
                  domain: string;
                  dr: number;
                  anchor_text: string;
                  do_follow: boolean;
                  date_live: string;
                  page_url: string;
                }) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">{item.domain}</td>
                    <td className="px-6 py-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                        DR {item.dr}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{item.anchor_text}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${item.do_follow ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.do_follow ? "Dofollow" : "Nofollow"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-400">{item.date_live ? formatDate(item.date_live) : "—"}</td>
                    <td className="px-6 py-3">
                      <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
