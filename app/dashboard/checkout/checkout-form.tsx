"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PACKAGES } from "@/lib/paypal";
import { ArrowLeft, Copy, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "paypal" | "usdt";
type UsdtNetwork = "TRC20" | "ERC20";

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planSlug = searchParams.get("plan");
  const pkg = PACKAGES.find((p) => p.slug === planSlug) ?? PACKAGES[1];

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

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  async function handleUsdtSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/usdt/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageSlug: pkg.slug,
        targetUrl,
        keywords,
        notes,
        txHash,
        network,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

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
      <button
        onClick={() => step === "payment" ? setStep("details") : router.back()}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete your order</h1>
      <p className="text-gray-500 text-sm mb-8">
        {step === "details" ? "Tell us about your site" : "Choose your payment method"}
      </p>

      {/* Plan summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{pkg.name} Plan</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {pkg.linksMin}–{pkg.linksMax} placements · DR {pkg.drMin}+ domains
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {pkg.priceLabel}<span className="text-sm text-gray-400">/mo</span>
          </p>
        </div>
      </div>

      {/* Step 1: Site details */}
      {step === "details" && (
        <form onSubmit={handleDetailsSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">The website you want to build authority for</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. best crm software, project management tool"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Specific pages to target, niches to avoid, etc."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue to Payment →
          </button>
        </form>
      )}

      {/* Step 2: Payment */}
      {step === "payment" && (
        <div className="space-y-4">
          {/* Method selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMethod("paypal")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${method === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-700 font-bold text-lg">Pay</span>
                <span className="text-blue-400 font-bold text-lg">Pal</span>
              </div>
              <p className="text-xs text-gray-500">PayPal · Credit Card · Debit Card</p>
            </button>
            <button
              onClick={() => setMethod("usdt")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${method === "usdt" ? "border-green-500 bg-green-50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-700 font-bold text-lg">₮ USDT</span>
              </div>
              <p className="text-xs text-gray-500">Tether · TRC20 or ERC20</p>
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* PayPal */}
          {method === "paypal" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-xs text-gray-400 mb-4 text-center">
                You&apos;ll be redirected to PayPal to complete payment securely
              </p>
              <PayPalScriptProvider options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: "USD",
              }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                  createOrder={async () => {
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ packageSlug: pkg.slug }),
                    });
                    const data = await res.json();
                    return data.id;
                  }}
                  onApprove={async (data) => {
                    setLoading(true);
                    const res = await fetch("/api/paypal/capture-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        paypalOrderId: data.orderID,
                        packageSlug: pkg.slug,
                        targetUrl,
                        keywords,
                        notes,
                      }),
                    });
                    const result = await res.json();
                    if (result.orderId) {
                      router.push(`/dashboard/orders/${result.orderId}?payment=paypal`);
                    } else {
                      setError("Payment captured but order failed. Contact support.");
                      setLoading(false);
                    }
                  }}
                  onError={() => setError("PayPal error. Please try again or use USDT.")}
                />
              </PayPalScriptProvider>
              {loading && (
                <p className="text-center text-xs text-gray-400 mt-3">Processing payment...</p>
              )}
            </div>
          )}

          {/* USDT */}
          {method === "usdt" && (
            <form onSubmit={handleUsdtSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
              {/* Network selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                <div className="flex gap-2">
                  {(["TRC20", "ERC20"] as UsdtNetwork[]).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNetwork(n)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${network === n ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      {n}
                      {n === "TRC20" && <span className="ml-1 text-xs text-gray-400">(low fee)</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Send exactly</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(pkg.price / 100).toFixed(2)} <span className="text-green-600">USDT</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">via {network}</p>
              </div>

              {/* Wallet address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send to this address ({network})
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs text-gray-700 break-all">
                    {USDT_ADDRESS ?? "Address not configured"}
                  </code>
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="flex-shrink-0 p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-700 space-y-1">
                <p className="font-medium">Before submitting:</p>
                <p>1. Send exactly <strong>{(pkg.price / 100).toFixed(2)} USDT</strong> via {network}</p>
                <p>2. Copy your transaction hash from your wallet</p>
                <p>3. Paste it below and submit</p>
                <p>4. We verify within 2–4 hours and activate your order</p>
              </div>

              {/* TX Hash */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Hash <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste your TX hash here"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Transaction for Verification"}
              </button>
              <p className="text-xs text-center text-gray-400">
                Order activates after manual verification (2–4 hrs)
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
