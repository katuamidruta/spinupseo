import ProductForm from "@/components/admin/product-form";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">← Back to Products</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Add New Product</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <ProductForm />
      </div>
    </div>
  );
}
