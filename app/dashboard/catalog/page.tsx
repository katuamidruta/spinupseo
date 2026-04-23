import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/dashboard/product-card";
import { CATEGORIES } from "@/lib/paypal";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const query = supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (category && category !== "all") {
    query.eq("category", category);
  }

  const { data: products } = await query;

  const allCategories = [
    { key: "all", label: "All Products" },
    ...Object.entries(CATEGORIES).map(([key, val]) => ({ key, label: val.label })),
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Link Building Catalog</h1>
        <p className="text-gray-500 text-sm mt-1">{products?.length ?? 0} products available</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map(({ key, label }) => {
          const isActive = (!category && key === "all") || category === key;
          return (
            <a
              key={key}
              href={key === "all" ? "/dashboard/catalog" : `/dashboard/catalog?category=${key}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Product grid */}
      {!products?.length ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No products in this category yet</p>
          <p className="text-sm mt-1">Check back soon or browse all categories</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={{
              ...product,
              features: Array.isArray(product.features) ? product.features : [],
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
