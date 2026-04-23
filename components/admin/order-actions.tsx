"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReportItem = {
  domain: string;
  page_url: string;
  dr: number;
  anchor_text: string;
  do_follow: boolean;
  date_live: string;
};

const EMPTY_ITEM: ReportItem = {
  domain: "",
  page_url: "",
  dr: 0,
  anchor_text: "",
  do_follow: true,
  date_live: "",
};

export default function AdminOrderActions({
  order,
  report,
}: {
  order: { id: string; status: string };
  report: { id: string; summary: string; report_items: ReportItem[] } | null;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [summary, setSummary] = useState(report?.summary ?? "");
  const [items, setItems] = useState<ReportItem[]>(
    report?.report_items?.length ? report.report_items : [{ ...EMPTY_ITEM }]
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus(status: string) {
    setUpdating(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    router.refresh();
  }

  function addRow() {
    setItems([...items, { ...EMPTY_ITEM }]);
  }

  function removeRow(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ReportItem, value: string | boolean | number) {
    const next = [...items];
    (next[index] as Record<string, unknown>)[field] = value;
    setItems(next);
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage("");

    const res = await fetch(`/api/admin/orders/${order.id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary, items }),
    });

    if (res.ok) {
      setMessage("Report saved and order marked as completed.");
      router.refresh();
    } else {
      const d = await res.json();
      setMessage(d.error ?? "Failed to save report");
    }
    setSubmitLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Status controls */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => updateStatus("pending")}
            disabled={updating || order.status === "pending"}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50 disabled:opacity-40 transition-colors"
          >
            ✓ Verify &amp; Set Pending
          </button>
          <button
            onClick={() => updateStatus("processing")}
            disabled={updating || order.status === "processing"}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-40 transition-colors"
          >
            Processing
          </button>
          <button
            onClick={() => updateStatus("cancelled")}
            disabled={updating || order.status === "cancelled"}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Report upload */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          {report ? "Edit Report" : "Upload Report"}
        </h2>

        {message && (
          <div className="mb-4 text-sm px-4 py-3 rounded-lg bg-blue-50 text-blue-700">{message}</div>
        )}

        <form onSubmit={submitReport} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Summary / Notes</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="e.g. All 20 links placed on high-traffic SaaS blogs, dofollow."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">Backlinks ({items.length})</label>
              <button type="button" onClick={addRow} className="text-xs text-blue-600 hover:underline">
                + Add row
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Domain</th>
                    <th className="px-3 py-2 text-left font-medium">Page URL</th>
                    <th className="px-3 py-2 text-left font-medium w-16">DR</th>
                    <th className="px-3 py-2 text-left font-medium">Anchor</th>
                    <th className="px-3 py-2 text-left font-medium w-20">Follow</th>
                    <th className="px-3 py-2 text-left font-medium">Date Live</th>
                    <th className="px-3 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5">
                        <input
                          required
                          value={item.domain}
                          onChange={(e) => updateItem(i, "domain", e.target.value)}
                          placeholder="example.com"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          required
                          value={item.page_url}
                          onChange={(e) => updateItem(i, "page_url", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.dr}
                          onChange={(e) => updateItem(i, "dr", parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          value={item.anchor_text}
                          onChange={(e) => updateItem(i, "anchor_text", e.target.value)}
                          placeholder="anchor text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={item.do_follow}
                          onChange={(e) => updateItem(i, "do_follow", e.target.checked)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="date"
                          value={item.date_live}
                          onChange={(e) => updateItem(i, "date_live", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {submitLoading ? "Saving…" : report ? "Update Report" : "Save Report & Mark Completed"}
          </button>
        </form>
      </div>
    </div>
  );
}
