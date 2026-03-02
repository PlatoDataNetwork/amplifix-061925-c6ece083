import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Send, Megaphone, BarChart3, Users, Shield, Zap, Globe, Clock,
  ChevronDown, ChevronRight, Mail, Phone, Building2, Scale,
  Target, Layers, TrendingUp, Search, Filter, ExternalLink,
  CheckCircle2, ArrowRight, Sparkles, Network, FileText, MousePointerClick,
  MessageSquare, Briefcase, Lock, Eye, Star, Quote, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/* ─── tiny helpers ─── */
const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ─── data ─── */
const NAV = ["Solutions", "How It Works", "Campaign Types", "Case Spotlight", "Trust", "FAQ", "Contact"];

const PILLARS = [
  {
    icon: FileText, title: "Press Release Distribution",
    desc: "Editorial-ready releases engineered for maximum pickup and engagement.",
    bullets: ["Timed drops with embargo controls", "Tracking links + UTM attribution"],
  },
  {
    icon: Network, title: "Syndication Network",
    desc: "Programmatic republishing across 500+ publisher endpoints.",
    bullets: ["Partner placements & feed/API integrations", "Real-time syndication dashboards"],
  },
  {
    icon: Target, title: "Recruitment Funnel Engine",
    desc: "Per-case, per-ticker landing pages with segmentation built in.",
    bullets: ["Multi-step qualification funnels", "Retargeting-ready pixel integration"],
  },
  {
    icon: BarChart3, title: "Engagement Ops",
    desc: "Full-cycle lead capture, nurture, and conversion reporting.",
    bullets: ["Email / SMS capture flows + lead scoring", "Real-time dashboards & conversion analytics"],
  },
];

const STEPS = [
  { title: "Intake", desc: "Case details, targeting goals, compliance review" },
  { title: "Build", desc: "Release copy, campaign pages, funnel paths" },
  { title: "Distribute", desc: "Syndication, partners, social, search" },
  { title: "Engage", desc: "Nurture sequences, segmentation, capture" },
  { title: "Optimize", desc: "Attribution, A/B testing, reporting" },
];

const CAMPAIGN_TYPES = [
  { title: "Securities / Investor", desc: "Public company shareholder class actions with ticker-based targeting.", icon: TrendingUp },
  { title: "Consumer Protection", desc: "Product recalls, deceptive practices, and consumer fraud campaigns.", icon: Shield },
  { title: "Employment / Wage & Hour", desc: "Workplace violations, wage theft, and employee rights recruitment.", icon: Briefcase },
  { title: "Data Breach / Privacy", desc: "Identity theft, data exposure, and privacy violation claims.", icon: Lock },
  { title: "Antitrust / Competition", desc: "Price-fixing, market manipulation, and anti-competitive behavior.", icon: Scale },
  { title: "Product Liability", desc: "Defective products, medical devices, and pharmaceutical claims.", icon: Eye },
];

const CASES = [
  { company: "ACME Corp", ticker: "ACME", type: "Securities", status: "Active", summary: "Alleged misleading financial disclosures Q3 2025", updated: "Feb 12, 2026" },
  { company: "DataVault Inc", ticker: "DVT", type: "Data Breach", status: "Active", summary: "Breach affecting 2.1M user records", updated: "Feb 10, 2026" },
  { company: "GreenLeaf Holdings", ticker: "GLH", type: "Securities", status: "Monitoring", summary: "Under investigation for accounting irregularities", updated: "Feb 8, 2026" },
  { company: "MedPharma Corp", ticker: "MPH", type: "Product Liability", status: "Active", summary: "Recall of cardiac implant devices", updated: "Feb 15, 2026" },
];

const FAQS = [
  { q: "How is AmplifiX Legal different from a PR wire?", a: "Traditional wires blast and forget. We combine press distribution with programmatic recruitment funnels, multi-channel engagement, and real-time attribution — turning every release into a measurable campaign." },
  { q: "Can you build a funnel per case and per company/ticker?", a: "Absolutely. Every campaign gets its own landing page ecosystem — segmented by ticker, case type, and audience persona — with independent tracking and reporting." },
  { q: "What channels do you support?", a: "Press syndication, search (SEO/SEM), social media, email, SMS, display/retargeting, partner placements, and direct publisher integrations." },
  { q: "How do you handle compliance and consent?", a: "Compliance is baked into every workflow. We support TCPA-compliant capture, configurable consent language, opt-in/opt-out controls, and full audit trails." },
  { q: "Do you work directly with law firms only?", a: "No. We work with law firms, litigation finance groups, case marketers, PR/IR teams, and media partners — anyone involved in class action awareness and recruitment." },
  { q: "Can you support multi-language campaigns?", a: "Yes. We support multi-language releases, landing pages, and capture forms to reach diverse claimant populations." },
  { q: "What reporting do we get?", a: "Real-time dashboards with impressions, clicks, conversions, lead quality scores, channel attribution, funnel drop-off analysis, and exportable reports." },
  { q: "What's the typical launch timeline?", a: "Most campaigns go from intake to live in 3–5 business days. Urgent filings can be turned around in 24–48 hours." },
];

/* ─── StatusBadge ─── */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    Monitoring: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Closed: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };
  return <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border", colors[status] || colors.Closed)}>{status}</span>;
};

/* ─── GlassCard ─── */
const GlassCard = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg", className)} {...props}>
    {children}
  </div>
);

/* ─── CampaignModal ─── */
const CampaignModal = ({ item, onClose }: { item: typeof CAMPAIGN_TYPES[0]; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <GlassCard className="max-w-lg w-full p-8 relative border-white/15" onClick={(e) => e.stopPropagation()}>
      <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"><X size={20} /></button>
      <item.icon className="w-10 h-10 mb-4 text-blue-400" />
      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
      <p className="text-zinc-300 mb-5">{item.desc}</p>
      <div className="space-y-3 text-sm text-zinc-400">
        <p><span className="text-zinc-200 font-medium">Typical Funnel:</span> Awareness → Qualification → Capture → Nurture → Conversion</p>
        <p><span className="text-zinc-200 font-medium">Recommended Channels:</span> Press syndication, search, social retargeting, email/SMS</p>
        <p><span className="text-zinc-200 font-medium">Outcomes:</span> Qualified lead capture, claimant verification, engagement reporting</p>
      </div>
      <button onClick={() => { onClose(); scrollTo("contact"); }} className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:brightness-110 transition">Launch This Campaign Type</button>
    </GlassCard>
  </div>
);

/* ═══════════════════════════════════════════════ */
/*                  MAIN PAGE                      */
/* ═══════════════════════════════════════════════ */
const LegalLanding = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [formTab, setFormTab] = useState(0);
  const [caseTab, setCaseTab] = useState<"spotlight" | "releases">("spotlight");
  const [submitted, setSubmitted] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCases = statusFilter === "All" ? CASES : CASES.filter(c => c.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#07090F] text-zinc-100 font-sans antialiased">
      <Helmet>
        <title>AmplifiX Legal — Press Distribution + Recruitment Funnels for Class Actions</title>
        <meta name="description" content="AmplifiX Legal delivers press release distribution, syndication, and programmatic recruitment funnels for class action campaigns involving publicly traded companies. Compliant, measurable, scalable." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AmplifiX Legal",
          url: "https://legal.amplifix.net",
          description: "Press distribution and recruitment funnels for class actions",
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(f => ({
            "@type": "Question", name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
      </Helmet>

      {/* ── 1. STICKY HEADER ── */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-[#07090F]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 h-16">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt="AmplifiX Logo"
              className="w-8 h-8 md:w-10 md:h-10"
            />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent text-xl md:text-2xl font-extrabold">AmplifiX</span>
            <span className="text-zinc-400 font-normal text-xl md:text-2xl">Legal</span>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-sm text-zinc-400">
            {NAV.map(n => (
              <button key={n} onClick={() => scrollTo(n.toLowerCase().replace(/ /g, "-"))} className="hover:text-white transition-colors">{n}</button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <button onClick={() => scrollTo("contact")} className="text-sm text-zinc-300 hover:text-white transition-colors">Distribute a Release</button>
            <button onClick={() => scrollTo("contact")} className="text-sm px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:brightness-110 transition">Launch a Campaign</button>
          </div>

          <button className="lg:hidden text-zinc-300" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">
            {mobileNav ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileNav && (
          <nav className="lg:hidden bg-[#07090F]/95 backdrop-blur-xl border-t border-white/5 px-5 pb-5 space-y-3">
            {NAV.map(n => (
              <button key={n} onClick={() => { scrollTo(n.toLowerCase().replace(/ /g, "-")); setMobileNav(false); }} className="block text-sm text-zinc-400 hover:text-white transition-colors py-1">{n}</button>
            ))}
            <div className="py-2">
              <LanguageSwitcher isMobile />
            </div>
            <button onClick={() => { scrollTo("contact"); setMobileNav(false); }} className="block w-full text-center text-sm px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold">Launch a Campaign</button>
          </nav>
        )}
      </header>

      {/* ── 2. HERO ── */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* animated bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[160px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[140px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-8">
            <Sparkles size={14} className="text-blue-400" /> A division of AmplifiX.net
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Turn Cases into Campaigns.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Turn Campaigns into Claimants.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10 leading-relaxed">
            Press releases, multi-channel syndication, and programmatic recruitment funnels — purpose-built for class action campaigns involving publicly traded companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button onClick={() => scrollTo("contact")} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-base hover:brightness-110 transition shadow-lg shadow-blue-600/20">
              Launch a Recruitment Funnel <ArrowRight size={18} className="inline ml-1" />
            </button>
            <button onClick={() => scrollTo("contact")} className="px-8 py-3.5 rounded-xl border border-white/15 text-zinc-200 font-semibold text-base hover:bg-white/5 transition">
              Distribute a Press Release
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-500">
            {[
              { icon: Shield, t: "Compliant workflows" },
              { icon: BarChart3, t: "Analytics + attribution" },
              { icon: Globe, t: "Multi-channel distribution" },
              { icon: Zap, t: "Fast turnaround" },
            ].map(({ icon: I, t }) => (
              <span key={t} className="flex items-center gap-2"><I size={15} className="text-zinc-600" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE DO ── */}
      <section id="solutions" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">What We Do</h2>
          <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-14">Four integrated pillars that take your case from announcement to qualified claimant — with compliance and attribution at every step.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {PILLARS.map((p, i) => (
              <GlassCard key={i} className="p-7 group hover:border-blue-500/20 transition-all duration-300 hover:shadow-blue-600/5 hover:shadow-xl">
                <p.icon className="w-9 h-9 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                <p className="text-zinc-400 text-sm mb-4">{p.desc}</p>
                <ul className="space-y-1.5">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-zinc-500">
                      <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-zinc-400 text-center max-w-xl mx-auto mb-16">From intake to optimization — a streamlined pipeline designed for speed and scale.</p>
          <div className="relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {STEPS.map((s, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/10 flex items-center justify-center text-xl font-bold text-blue-400">
                    {i + 1}
                  </div>
                  <h4 className="font-semibold mb-1">{s.title}</h4>
                  <p className="text-xs text-zinc-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <GlassCard className="mt-14 p-6 text-center border-blue-500/10">
            <p className="text-sm text-zinc-300"><Zap size={15} className="inline text-blue-400 mr-1" /> From zero to live campaign in days — built to scale across multiple cases and tickers.</p>
          </GlassCard>
        </div>
      </section>

      {/* ── 5. CAMPAIGN TYPES ── */}
      <section id="campaign-types" className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Campaign Types</h2>
          <p className="text-zinc-400 text-center max-w-xl mx-auto mb-14">Purpose-built funnels for every class action category.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAMPAIGN_TYPES.map((ct, i) => (
              <button key={i} onClick={() => setActiveModal(i)} className="text-left">
                <GlassCard className="p-6 h-full group hover:border-blue-500/20 transition-all duration-300 hover:shadow-blue-600/5 hover:shadow-xl cursor-pointer">
                  <ct.icon className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold mb-2">{ct.title}</h4>
                  <p className="text-sm text-zinc-500 mb-3">{ct.desc}</p>
                  <span className="text-xs text-blue-400 flex items-center gap-1">Details <ChevronRight size={14} /></span>
                </GlassCard>
              </button>
            ))}
          </div>
        </div>
        {activeModal !== null && <CampaignModal item={CAMPAIGN_TYPES[activeModal]} onClose={() => setActiveModal(null)} />}
      </section>

      {/* ── 6. CASE SPOTLIGHT ── */}
      <section id="case-spotlight" className="py-24 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Case Spotlight</h2>
          <p className="text-zinc-400 text-center max-w-xl mx-auto mb-10">Active campaigns and press releases — updated in real time.</p>

          {/* tabs */}
          <div className="flex justify-center gap-3 mb-8">
            {(["spotlight", "releases"] as const).map(t => (
              <button key={t} onClick={() => setCaseTab(t)} className={cn("px-5 py-2 rounded-xl text-sm font-medium transition-all", caseTab === t ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-zinc-500 border border-white/5 hover:text-zinc-300")}>
                {t === "spotlight" ? "Campaign Pages" : "Press Releases"}
              </button>
            ))}
          </div>

          {/* filter */}
          <div className="flex gap-2 mb-6 justify-center">
            {["All", "Active", "Monitoring", "Closed"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all", statusFilter === s ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300")}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {filteredCases.map((c, i) => (
              <GlassCard key={i} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{c.company} <span className="text-zinc-500 font-normal text-sm">({c.ticker})</span></h4>
                    <span className="text-xs text-zinc-500">{c.type}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-sm text-zinc-400 mb-3">{c.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">Updated {c.updated}</span>
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition">See Updates</button>
                    <button className="text-xs px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition">Check Eligibility</button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
          <p className="text-xs text-zinc-600 text-center mt-6">* Sample entries for demonstration purposes. Actual cases populated upon engagement.</p>
        </div>
      </section>

      {/* ── 7. TRUST / PROOF ── */}
      <section id="trust" className="py-24">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Distribution + Marketing Capabilities</h2>
          <p className="text-zinc-400 text-center max-w-xl mx-auto mb-14">Trusted by litigation teams and case marketers to drive measurable claimant engagement.</p>

          {/* logos placeholder */}
          <div className="flex flex-wrap justify-center gap-8 mb-16 opacity-30">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-28 h-10 rounded-lg bg-white/10" />
            ))}
          </div>

          {/* metrics */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { metric: "500+", label: "Publisher endpoints" },
              { metric: "3.2×", label: "Average CTR uplift" },
              { metric: "10K+", label: "Qualified leads per campaign" },
            ].map((m, i) => (
              <GlassCard key={i} className="p-6 text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">{m.metric}</p>
                <p className="text-sm text-zinc-500 mt-1">{m.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* testimonials */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quote: "AmplifiX Legal helped us reach 4× more qualified claimants in half the time. Their funnel architecture is best-in-class.", author: "Managing Partner", firm: "Securities Litigation Firm" },
              { quote: "The syndication network and attribution dashboards gave us visibility we never had with traditional PR wires.", author: "Director of Operations", firm: "Litigation Finance Group" },
            ].map((t, i) => (
              <GlassCard key={i} className="p-7">
                <Quote size={20} className="text-blue-500/40 mb-3" />
                <p className="text-sm text-zinc-300 italic mb-4">"{t.quote}"</p>
                <p className="text-xs text-zinc-500"><span className="text-zinc-400 font-medium">{t.author}</span> — {t.firm}</p>
              </GlassCard>
            ))}
          </div>
          <p className="text-xs text-zinc-600 text-center mt-6">* Metrics are illustrative. Past performance is not indicative of future results.</p>
        </div>
      </section>

      {/* ── 8. COMPLIANCE ── */}
      <section className="py-24 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Compliance-First Approach</h2>
          <p className="text-zinc-400 text-center max-w-xl mx-auto mb-12">Every workflow is designed with regulatory compliance as a foundation, not an afterthought.</p>
          <div className="space-y-3">
            {[
              { title: "No Legal Advice", body: "Nothing on this site constitutes legal advice. AmplifiX Legal provides marketing, distribution, and engagement services. Always consult a qualified attorney for legal guidance." },
              { title: "No Attorney-Client Relationship", body: "Submitting a form or inquiry does not create an attorney-client relationship. Information provided is used solely for campaign planning and engagement purposes." },
              { title: "No Guaranteed Outcomes", body: "Past campaign performance, metrics, and testimonials are illustrative only. Results vary based on case specifics, market conditions, and many other factors." },
              { title: "Confidential Information", body: "Do not submit privileged or confidential information through any form on this site. Use secure communication channels provided after engagement." },
              { title: "TCPA / Consent Compliance", body: "All SMS and email capture flows include proper consent language, opt-in mechanisms, and comply with TCPA, CAN-SPAM, and applicable state regulations." },
            ].map((d, i) => (
              <GlassCard key={i} className="overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === -100 - i ? null : -100 - i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-sm flex items-center gap-2"><Shield size={16} className="text-blue-400" />{d.title}</span>
                  <ChevronDown size={16} className={cn("text-zinc-500 transition-transform", faqOpen === -100 - i && "rotate-180")} />
                </button>
                {faqOpen === -100 - i && <div className="px-5 pb-5 text-sm text-zinc-400 -mt-1">{d.body}</div>}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. LEAD CAPTURE ── */}
      <section id="contact" className="py-24">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Get Started</h2>
          <p className="text-zinc-400 text-center max-w-xl mx-auto mb-10">Tell us about your case or project. We'll respond within one business day.</p>

          {submitted ? (
            <GlassCard className="p-10 text-center border-emerald-500/20">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Thank You</h3>
              <p className="text-zinc-400 text-sm mb-6">Our team will be in touch shortly. For immediate scheduling:</p>
              <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-sm hover:brightness-110 transition">
                Schedule a Call <ExternalLink size={14} />
              </a>
            </GlassCard>
          ) : (
            <GlassCard className="p-8">
              {/* tabs */}
              <div className="flex border-b border-white/5 mb-8 -mt-1 gap-1">
                {["Law Firm / Partner", "Potential Claimant", "Media / Publisher"].map((t, i) => (
                  <button key={t} onClick={() => setFormTab(i)} className={cn("flex-1 text-sm font-medium py-3 transition-all border-b-2 -mb-px", formTab === i ? "border-blue-500 text-white" : "border-transparent text-zinc-500 hover:text-zinc-300")}>
                    {t}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                {formTab === 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input required placeholder="Full Name *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                      <input required placeholder="Firm / Organization *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input type="email" required placeholder="Email *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                      <input type="tel" placeholder="Phone" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                    </div>
                    <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-blue-500/50 transition">
                      <option value="">Case Type</option>
                      {CAMPAIGN_TYPES.map(c => <option key={c.title}>{c.title}</option>)}
                    </select>
                    <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-blue-500/50 transition">
                      <option value="">Urgency</option>
                      <option>Immediate (filing deadline approaching)</option>
                      <option>Within 30 days</option>
                      <option>Planning / exploratory</option>
                    </select>
                    <textarea rows={3} placeholder="Tell us about your case or project..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition resize-none" />
                  </>
                )}

                {formTab === 1 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input required placeholder="Full Name *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                      <input required placeholder="Email or Phone *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                    </div>
                    <input placeholder="State / Province" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                    <textarea rows={3} required placeholder="How were you affected? *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition resize-none" />
                    <div className="space-y-2 text-xs text-zinc-500">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" required className="mt-0.5 accent-blue-500" />
                        <span>I consent to being contacted via email/SMS regarding potential legal actions. Standard message and data rates may apply. *</span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" className="mt-0.5 accent-blue-500" />
                        <span>I agree to the <button type="button" className="underline text-blue-400">Privacy Policy</button> and <button type="button" className="underline text-blue-400">Terms of Service</button>.</span>
                      </label>
                    </div>
                  </>
                )}

                {formTab === 2 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input required placeholder="Organization *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                      <input placeholder="Website" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                    </div>
                    <input type="email" required placeholder="Contact Email *" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition" />
                    <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-blue-500/50 transition">
                      <option value="">Syndication Interest</option>
                      <option>Press release republishing</option>
                      <option>Content partnership</option>
                      <option>Affiliate / referral</option>
                      <option>API integration</option>
                    </select>
                    <textarea rows={3} placeholder="Tell us about your syndication needs..." className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition resize-none" />
                  </>
                )}

                <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:brightness-110 transition shadow-lg shadow-blue-600/20">
                  Submit Inquiry <Send size={16} className="inline ml-1" />
                </button>
              </form>
            </GlassCard>
          )}
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section id="faq" className="py-24 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-zinc-400 text-center mb-12">Everything you need to know about AmplifiX Legal.</p>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <GlassCard key={i} className="overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium text-sm pr-4">{f.q}</span>
                  <ChevronDown size={16} className={cn("text-zinc-500 transition-transform shrink-0", faqOpen === i && "rotate-180")} />
                </button>
                {faqOpen === i && <div className="px-5 pb-5 text-sm text-zinc-400 -mt-1">{f.a}</div>}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FOOTER ── */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
                alt="AmplifiX Logo"
                className="w-6 h-6"
              />
              <span className="font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">AmplifiX</span>
              <span className="text-zinc-500 text-sm">Legal</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <a href="/privacy-policy" className="hover:text-zinc-300 transition">Privacy</a>
              <a href="/terms-of-service" className="hover:text-zinc-300 transition">Terms</a>
              <button onClick={() => scrollTo("contact")} className="hover:text-zinc-300 transition">Contact</button>
              <span>Disclosures</span>
            </div>
            <div className="flex gap-4 text-zinc-600">
              {/* social placeholders */}
              {["X", "in", "f"].map(s => (
                <div key={s} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs hover:border-white/20 hover:text-zinc-400 transition cursor-pointer">{s}</div>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-600 text-center mt-8">© {new Date().getFullYear()} AmplifiX.net — AmplifiX Legal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LegalLanding;
