import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Shield, BarChart3, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">Spinup<span className="text-blue-600">SEO</span></span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link href="/signup" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-blue-100">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          DR 90+ · DA 80+ · 100% Google Indexed
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
          Rank Higher on Google<br />
          <span className="text-blue-600">With Premium Backlinks</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          The complete link building platform for serious SEOs and growing brands.
          PBN, Contextual, EDU, and more — all managed in one dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base">
            Start Building Authority <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-base">
            Sign In to Dashboard
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4 flex items-center justify-center gap-1">
          <Lock size={12} /> Create a free account to view all packages & pricing
        </p>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Link Products" },
            { value: "DR 90+", label: "Max Domain Rating" },
            { value: "100%", label: "Google Indexed" },
            { value: "24/7", label: "Support" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we offer */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Every Link Type You Need</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            Sign up to access our full catalog of 50+ link building products across all major categories.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔗",
                title: "PBN Links",
                desc: "Private Blog Network placements on aged, high-authority domains. DA 30–60+, unique IPs, dofollow.",
                tags: ["DA 50+", "Dofollow", "Aged Domains"],
              },
              {
                icon: "📝",
                title: "Contextual Links",
                desc: "Niche-relevant backlinks embedded in real content. High DA, diverse IPs, 100% indexed.",
                tags: ["Niche Relevant", "DA 40+", "IP Diversity"],
              },
              {
                icon: "🎓",
                title: "EDU & GOV Backlinks",
                desc: "Backlinks from .edu and .gov domains. Among the most trusted signals in Google's algorithm.",
                tags: ["DA 70+", "High Trust", ".edu/.gov"],
              },
              {
                icon: "📦",
                title: "SEO Packages",
                desc: "Expert-curated bundles combining Web 2.0, EDU, forum, and profile links for maximum impact.",
                tags: ["Mixed Strategy", "DA/PA 50–90", "Full Report"],
              },
              {
                icon: "⚡",
                title: "Authority Boost",
                desc: "Directly increase your Ahrefs DR, Moz DA, or Majestic Trust Flow score within 30 days.",
                tags: ["DR Boost", "DA Boost", "Trust Flow"],
              },
              {
                icon: "📊",
                title: "Full Reporting",
                desc: "Every order comes with a detailed Excel report. Every link, every metric, fully transparent.",
                tags: ["Excel Report", "Live URLs", "Metrics"],
              },
            ].map(({ icon, title, desc, tags }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <span className="text-3xl mb-4 block">{icon}</span>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: TrendingUp, title: "Create your account", desc: "Sign up in 30 seconds. Get instant access to our full product catalog and pricing." },
              { step: "02", icon: BarChart3, title: "Choose your links", desc: "Browse 50+ products. Filter by type, budget, or authority level. Order in one click." },
              { step: "03", icon: Shield, title: "Track & receive", desc: "Monitor your order status live. Receive a full backlink report with every placement." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-xs font-bold text-blue-600 mb-2">{step}</p>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why SpinupSEO</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "DR 90+ and DA 80+ domains available",
              "All links 100% Google indexed",
              "Unique IP addresses on every order",
              "Detailed Excel report on delivery",
              "PayPal & USDT payment accepted",
              "24/7 WhatsApp support",
              "Safe, natural-looking link profiles",
              "Fast turnaround — most orders in 7 days",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle2 size={18} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to rank higher?</h2>
          <p className="text-blue-100 mb-8">Create a free account to access full pricing and start your first order.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            Get Free Access <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-gray-900">Spinup<span className="text-blue-600">SEO</span></span>
          <p className="text-xs text-gray-400">© 2025 SpinupSEO. All rights reserved.</p>
          <p className="text-xs text-gray-400">We deliver link placements. Rankings depend on many factors.</p>
        </div>
      </footer>
    </div>
  );
}
