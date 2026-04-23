import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CATEGORIES } from "@/lib/paypal";
import { cn } from "@/lib/utils";
import ToggleActive from "@/components/admin/toggle-active";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products?.length ?? 0} total products</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Product</th>
              <th className="px-6 py-3 text-left font-medium">Category</th>
              <th className="px-6 py-3 text-left font-medium">Links</th>
              <th className="px-6 py-3 text-left font-medium">Authority</th>
              <th className="px-6 py-3 text-left font-medium">Price</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products?.map((p) => {
              const cat = CATEGORIES[p.category] ?? CATEGORIES["general"];
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[220px]">{p.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", cat.color)}>
                      {cat.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.links_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.dr_range}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${(p.price_usd / 100).toFixed(0)}
                  </td>
                  <td className="px-6 py-4">
                    <ToggleActive id={p.id} isActive={p.is_active} />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/products/${p.id}/edit`}
                      className="text-xs text-blue-600 hover:underline">
                      Edit →
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
