"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ArrowLeft, Copy, Check, AlertCircle, Loader2 } from "lucide-react";

type Product = {
  id: string; name: string; slug: string;
  price_usd: number; links_count: string; dr_range: string;
};

type PaymentMethod = "paypal" | "usdt";
type UsdtNetwork = "TRC20" | "ERC20";

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [targetUrl, setTargetUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("paypal");
  const [network, setNetwork] = useState<UsdtNetwork>("TRC20");
  const [txHash, setTxHash] = useState("");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const USDT_ADDRESS = network === "TRC20"
    ? process.env.NEXT_PUBLIC_USDT_TRC20
    : process.env.NEXT_PUBLIC_USDT_ERC20;

  useEffect(() => {
    if (!productSlug) { router.push("/dashboard/catalog"); return; }
    fetch(`/api/packages/${productSlug}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d); setLoadingProduct(false); })
      .catch(() => router.push("/dashboard/catalog"));
  }, [productSlug, router]);

  if (loadingProduct) {
    return <div className="p-8 flex items-center gap-2 text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading product...</div>;
  }
  if (!product) return null;

  const price = (product.price_usd / 100).toFixed(2);

  async function handleUsdtSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/usdt/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: product!.slug, targetUrl, keywords, notes, txHash, network }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Error"); setLoading(false); return; }
    router.push(`/dashboard/orders/${data.orderId}?payment=usdt`);
  }

  async function copyAddress() {
    if (USDT_ADDRESS) {
      await navigator.clipboard.writeText(USDT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => step === "payment" ? setStep("details") : router.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Complete your order</h1>
      <p className="text-gray-500 text-sm mb-8">
        {step === "details" ? "Tell us about your website" : "Choose payment method"}
      </p>

      {/* Product summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{product.links_count} · {product.dr_range}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${price}</p>
        </div>
      </div>

      {/* Step 1 */}
      {step === "details" && (
        <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); }}
          className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input type="url" required value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-400 mt-1">The site you want to build authority for</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Keywords</label>
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. buy crm software, project management"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Target pages, niches to avoid, anchor preference..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Continue to Payment →
          </button>
        </form>
      )}

      {/* Step 2 */}
      {step === "payment" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(["paypal", "usdt"] as PaymentMethod[]).map((m) => (
              <button key={m} onClick={() => setMethod(m)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${method === m ? m === "paypal" ? "border-blue-500 bg-blue-50" : "border-green-500 bg-green-50" : "border-gray-100 bg-white"}`}>
                {m === "paypal" ? (
                  <>
                    <p className="font-bold text-blue-600 mb-0.5">PayPal</p>
                    <p className="text-xs text-gray-500">PayPal · Credit/Debit Card</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-green-700 mb-0.5">₮ USDT</p>
                    <p className="text-xs text-gray-500">TRC20 or ERC20</p>
                  </>
                )}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {method === "paypal" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-xs text-gray-400 mb-4 text-center">Redirects to PayPal secure checkout</p>
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                  createOrder={async () => {
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ productSlug: product!.slug }),
                    });
                    return (await res.json()).id;
                  }}
                  onApprove={async (data) => {
                    setLoading(true);
                    const res = await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ paypalOrderId: data.orderID, productSlug: product!.slug, targetUrl, keywords, notes }),
                    });
                    const result = await res.json();
                    if (result.orderId) router.push(`/dashboard/orders/${result.orderId}?payment=paypal`);
                    else { setError("Payment captured but order failed. Contact support."); setLoading(false); }
                  }}
                  onError={() => setError("PayPal error. Please try again or use USDT.")}
                />
              </PayPalScriptProvider>
              {loading && <p className="text-center text-xs text-gray-400 mt-3">Processing...</p>}
            </div>
          )}

          {method === "usdt" && (
            <form onSubmit={handleUsdtSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
              <div className="flex gap-2">
                {(["TRC20", "ERC20"] as UsdtNetwork[]).map((n) => (
                  <button key={n} type="button" onClick={() => setNetwork(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${network === n ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"}`}>
                    {n}{n === "TRC20" && <span className="ml-1 text-xs opacity-60">(low fee)</span>}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Send exactly</p>
                <p className="text-3xl font-bold text-gray-900">{price} <span className="text-green-600">USDT</span></p>
                <p className="text-xs text-gray-400 mt-1">via {network}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Send to ({network})</label>
                <div className="flex gap-2">
                  <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs break-all">
                    {USDT_ADDRESS ?? "Not configured"}
                  </code>
                  <button type="button" onClick={copyAddress}
                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-700 space-y-0.5">
                <p className="font-semibold mb-1">Steps:</p>
                <p>1. Send <strong>{price} USDT</strong> via {network} to the address above</p>
                <p>2. Copy your transaction hash from your wallet</p>
                <p>3. Paste below and submit — we verify within 2–4 hours</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash *</label>
                <input required value={txHash} onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste TX hash here"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60">
                {loading ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
