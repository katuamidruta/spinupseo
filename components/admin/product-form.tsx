"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/paypal";

type ProductData = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price_usd: number;
  links_count: string;
  dr_range: string;
  features: string[];
  badge: string;
  sort_order: number;
  is_active: boolean;
};

const EMPTY: ProductData = {
  name: "", slug: "", category: "pbn", description: "",
  price_usd: 0, links_count: "", dr_range: "",
  features: [], badge: "", sort_order: 0, is_active: true,
};

export default function ProductForm({ initial }: { initial?: Partial<ProductData> }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<ProductData>({ ...EMPTY, ...initial });
  const [featuresText, setFeaturesText] = useState(
    (initial?.features ?? []).join("\n")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof ProductData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price_usd: Math.round(form.price_usd),
      features: featuresText.split("\n").map((l) => l.trim()).filter(Boolean),
      badge: form.badge || null,
    };

    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Product Name *</label>
          <input required value={form.name} onChange={(e) => {
            set("name", e.target.value);
            if (!isEdit) set("slug", autoSlug(e.target.value));
          }} className={inputClass} placeholder="Starter PBN Pack" />
        </div>
        <div>
          <label className={labelClass}>Slug *</label>
          <input required value={form.slug} onChange={(e) => set("slug", e.target.value)}
            className={inputClass} placeholder="starter-pbn-pack" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
            {Object.entries(CATEGORIES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <select value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputClass}>
            <option value="">None</option>
            <option value="popular">Most Popular</option>
            <option value="best_value">Best Value</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea required value={form.description} onChange={(e) => set("description", e.target.value)}
          rows={2} className={inputClass + " resize-none"}
          placeholder="Short description shown on product card..." />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Price (USD) *</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">$</span>
            <input type="number" required min={1} value={form.price_usd / 100 || ""}
              onChange={(e) => set("price_usd", Math.round(parseFloat(e.target.value) * 100))}
              className={inputClass + " pl-7"} placeholder="49" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Links Count</label>
          <input value={form.links_count} onChange={(e) => set("links_count", e.target.value)}
            className={inputClass} placeholder="30 Links" />
        </div>
        <div>
          <label className={labelClass}>Authority Range</label>
          <input value={form.dr_range} onChange={(e) => set("dr_range", e.target.value)}
            className={inputClass} placeholder="DA 40+" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value))}
            className={inputClass} placeholder="10" />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)}
              className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-gray-700">Active (visible to users)</span>
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Features (one per line)</label>
        <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)}
          rows={8} className={inputClass + " resize-none font-mono text-xs"}
          placeholder={"30 PBN Backlinks\nDA 40+ Domains\nDofollow Links\nUnique IP Addresses\n100% Google Indexed"} />
        <p className="text-xs text-gray-400 mt-1">Each line = one feature bullet on the product card</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
