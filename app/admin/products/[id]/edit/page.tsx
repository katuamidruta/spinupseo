import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/product-form";
import Link from "next/link";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">← Back to Products</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <ProductForm initial={{
          ...product,
          features: Array.isArray(product.features) ? product.features : [],
          badge: product.badge ?? "",
        }} />
      </div>
    </div>
  );
}
