import Link from "next/link";
import { CATEGORIES } from "@/lib/paypal";
import { Check, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price_usd: number;
  links_count: string;
  dr_range: string;
  features: string[];
  badge: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const cat = CATEGORIES[product.category] ?? CATEGORIES["general"];
  const price = (product.price_usd / 100).toFixed(0);

  return (
    <div className={cn(
      "bg-white border rounded-2xl p-6 flex flex-col hover:shadow-md transition-all duration-200 relative",
      product.badge ? "border-blue-200 shadow-sm" : "border-gray-100"
    )}>
      {/* Badge */}
      {product.badge && (
        <div className="absolute -top-3 left-6">
          <span className={cn(
            "inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full",
            product.badge === "popular" ? "bg-blue-600 text-white" : "bg-amber-500 text-white"
          )}>
            {product.badge === "popular" ? <Star size={10} fill="white" /> : <Zap size={10} />}
            {product.badge === "popular" ? "Most Popular" : "Best Value"}
          </span>
        </div>
      )}

      {/* Category + title */}
      <div className="mb-4">
        <span className={cn("inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3", cat.color)}>
          {cat.label}
        </span>
        <h3 className="font-bold text-gray-900 text-base leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{product.description}</p>
      </div>

      {/* Metrics */}
      <div className="flex gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-center flex-1">
          <p className="text-xs text-gray-400">Links</p>
          <p className="text-xs font-bold text-gray-900">{product.links_count}</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-1.5 text-center flex-1">
          <p className="text-xs text-gray-400">Authority</p>
          <p className="text-xs font-bold text-gray-900">{product.dr_range}</p>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-1.5 mb-5 flex-1">
        {(product.features ?? []).slice(0, 5).map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
            <Check size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
        {(product.features ?? []).length > 5 && (
          <li className="text-xs text-gray-400">+{product.features.length - 5} more included</li>
        )}
      </ul>

      {/* Price + CTA */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">${price}</span>
            <span className="text-xs text-gray-400 ml-1">one-time</span>
          </div>
        </div>
        <Link href={`/dashboard/checkout?product=${product.slug}`}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
          Order Now
        </Link>
      </div>
    </div>
  );
}
