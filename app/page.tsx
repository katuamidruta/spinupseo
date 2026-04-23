import Link from "next/link";
import { PACKAGES } from "@/lib/paypal";
import { Check, ArrowRight, Shield, TrendingUp, FileText } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">LinkForge</span>
          <div className="flex items-center gap-6">
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
            <Link href="/signup" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          DR 40+ Vetted Domains Only
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Build Domain Authority<br />
          <span className="text-blue-600">That Lasts</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Strategic link acquisition for ambitious brands. We secure editorial placements
          on high-traffic publications — so you rank, and stay ranked.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#pricing" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            View Plans <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Sign In
          </Link>
        </div>

        {/* Social proof numbers */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-gray-100">
          <div>
            <p className="text-3xl font-bold text-gray-900">DR 40+</p>
            <p className="text-sm text-gray-500 mt-1">Minimum domain rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">10k+</p>
            <p className="text-sm text-gray-500 mt-1">Monthly traffic per site</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500 mt-1">Transparent reporting</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">How it works</h2>
          <p className="text-center text-gray-500 mb-14">Three steps to compounding organic growth</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, step: "01", title: "Choose your plan", desc: "Pick the authority-building tier that matches your growth goals." },
              { icon: Shield, step: "02", title: "We secure placements", desc: "Our team identifies, vets, and places your links on relevant, high-authority publications." },
              { icon: FileText, step: "03", title: "Get your report", desc: "Every placement delivered with full metrics: domain, DR, traffic, anchor text, and live URL." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-xs font-bold text-blue-600 mb-4">{step}</div>
                <Icon className="text-gray-900 mb-3" size={24} />
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple, predictable pricing</h2>
          <p className="text-center text-gray-500 mb-14">Monthly retainer. Cancel anytime. No contracts.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`rounded-2xl p-6 flex flex-col ${pkg.highlight ? "bg-blue-600 text-white ring-2 ring-blue-600" : "bg-white border border-gray-200"}`}>
                {pkg.highlight && (
                  <span className="text-xs font-semibold bg-white/20 text-white px-2 py-1 rounded-full self-start mb-4">Most Popular</span>
                )}
                <h3 className={`font-bold text-lg mb-1 ${pkg.highlight ? "text-white" : "text-gray-900"}`}>{pkg.name}</h3>
                <p className={`text-xs mb-4 ${pkg.highlight ? "text-blue-100" : "text-gray-500"}`}>{pkg.description}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${pkg.highlight ? "text-white" : "text-gray-900"}`}>{pkg.priceLabel}</span>
                  <span className={`text-sm ${pkg.highlight ? "text-blue-100" : "text-gray-400"}`}>/mo</span>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${pkg.highlight ? "text-blue-100" : "text-blue-600"}`} />
                      <span className={pkg.highlight ? "text-blue-50" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/signup?plan=${pkg.slug}`} className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-colors ${pkg.highlight ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-gray-900 text-white hover:bg-gray-700"}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            All plans include full transparency reporting. No PBNs. No spammy links. Ever.
          </p>
        </div>
      </section>

      {/* Trust / disclaimer */}
      <section className="px-6 py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            LinkForge delivers editorial placements on real, traffic-verified websites.
            We do not guarantee specific ranking positions — search rankings depend on many factors.
            Our service provides one component of a comprehensive SEO strategy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-gray-900">LinkForge</span>
          <p className="text-xs text-gray-400">© 2025 LinkForge. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
