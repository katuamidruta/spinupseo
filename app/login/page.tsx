"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — marketing */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 p-12 text-white">
        <Link href="/" className="text-xl font-bold">Spinup<span className="text-blue-400">SEO</span></Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            The Premium<br />Backlink Platform<br />
            <span className="text-blue-400">for Serious SEOs</span>
          </h2>
          <div className="space-y-3">
            {[
              "50+ Link Products — PBN, EDU, Contextual & more",
              "DA 80+ & DR 90+ domains available",
              "100% Google indexed, full Excel report",
              "PayPal & USDT accepted",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700">
          {[["50+", "Products"], ["DR 90+", "Max Authority"], ["24/7", "Support"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-bold text-white">{v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="text-xl font-bold text-gray-900">Spinup<span className="text-blue-600">SEO</span></Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
