import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Store } from "lucide-react";
import LogoutButton from "@/components/dashboard/logout-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-gray-900">
            Spinup<span className="text-blue-600">SEO</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <LayoutDashboard size={16} />
            Overview
          </Link>
          <Link href="/dashboard/catalog" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Store size={16} />
            All Products
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <ShoppingBag size={16} />
            My Orders
          </Link>
        </nav>
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-gray-700 truncate">{profile?.full_name ?? "User"}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          {profile?.role === "admin" && (
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg text-xs text-orange-600 hover:bg-orange-50 font-medium transition-colors">
              ⚡ Admin Panel
            </Link>
          )}
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
