import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { saveInquiry } from "../lib/inquiries";
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Palette, 
  Rocket, 
  ShieldCheck, 
  Utensils, 
  Coffee, 
  Dumbbell, 
  Scissors, 
  HardHat, 
  Layers, 
  CheckCircle2, 
  Send,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const DEMOS = [
  {
    id: "little-umbrella",
    title: "Little Umbrella",
    category: "Artisanal Cafe & Bakery",
    location: "West Point Grey · Vancouver, BC",
    description: "A cozy neighborhood cafe web experience featuring artisanal espresso, breakfast wraps, flaky croissants, digital menu showcase, and online ordering.",
    url: "https://little-umbrella.vercel.app/",
    icon: Coffee,
    badge: "Cafe & Bakery",
    categoryKey: "cafe",
    gradient: "from-amber-600/20 to-orange-950/40",
    tags: ["Vancouver, BC", "Online Ordering", "Digital Menu", "Google Rating 4.7★"]
  },
  {
    id: "dimsum-box",
    title: "DIMSUM BOX",
    category: "Restaurant & Asian Dining",
    location: "Morinda, Punjab",
    description: "Modern Asian-inspired dining destination in Morinda featuring handcrafted 100% Atta momos, interactive 5-category menu explorer, and real-time ordering cart.",
    url: "https://dimsum-box.vercel.app/",
    icon: Utensils,
    badge: "Restaurant & F&B",
    categoryKey: "restaurant",
    gradient: "from-emerald-600/20 to-slate-950/40",
    tags: ["Morinda, Punjab", "Handcrafted Atta Momos", "Cart System", "100+ Menu Items"]
  },
  {
    id: "the-first-step",
    title: "The First Step",
    category: "Luxury Footwear & Retail",
    location: "Sirhind, Punjab",
    description: "Premier footwear showroom in Sirhind featuring handmade formal shoes, everyday comfort sneakers, curated luxury collections, and direct WhatsApp shopping.",
    url: "https://the-first-step-five.vercel.app/",
    icon: Sparkles,
    badge: "Retail & Footwear",
    categoryKey: "retail",
    gradient: "from-sky-600/20 to-slate-950/40",
    tags: ["Sirhind, Punjab", "Handmade Footwear", "WhatsApp Catalogue", "Luxury Showroom"]
  }
];

const SERVICES = [
  {
    title: "Bespoke Web Design",
    desc: "Tailored UI/UX designed to match your brand identity with precision typography, responsive grids, and thoughtful micro-interactions.",
    icon: Palette
  },
  {
    title: "Full-Stack Development",
    desc: "Engineered with ultra-fast modern frameworks like React, TypeScript, and Vite for instant load times and rock-solid reliability.",
    icon: Code2
  },
  {
    title: "Performance & SEO",
    desc: "Optimized for core web vitals, mobile responsiveness, and high search engine ranking to drive organic conversion.",
    icon: Rocket
  },
  {
    title: "Secure & Cloud-Ready",
    desc: "Built with industry standard data protection, serverless edge integrations, and seamless analytics tracking.",
    icon: ShieldCheck
  }
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Strategy",
    desc: "We analyze your business goals, target audience, and competitive edge to craft a winning digital blueprint."
  },
  {
    step: "02",
    title: "Design & Architecture",
    desc: "Interactive wireframes and high-fidelity prototypes crafted to visualize every touchpoint before coding."
  },
  {
    step: "03",
    title: "Development & Polish",
    desc: "Clean, robust code engineered with modern frameworks, responsive styling, and fast performance."
  },
  {
    step: "04",
    title: "Launch & Support",
    desc: "Rigorous quality assurance, deployment to global CDN, and dedicated post-launch support."
  }
];

function Index() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Artisanal Cafe & Bakery (like Little Umbrella)",
    message: ""
  });

  const filteredDemos = activeFilter === "all"
    ? DEMOS
    : DEMOS.filter((d) => d.categoryKey === activeFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    saveInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType,
      message: formData.message
    });
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Announcement Bar */}
      <div className="border-b border-cyan-500/20 bg-cyan-950/40 px-4 py-2 text-center text-xs font-medium text-cyan-300">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>TWeb Studio: Modern High-Impact Digital Experiences & Custom Web Solutions</span>
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/tweb-logo.png" 
              alt="TWeb Logo" 
              className="h-9 w-auto object-contain rounded-md shadow-md"
              onError={(e) => {
                // fallback if image not ready
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="text-xl font-bold tracking-tight text-white">
              TWeb<span className="text-cyan-400">.</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#work" className="transition-colors hover:text-cyan-400">Our Work</a>
            <a href="#services" className="transition-colors hover:text-cyan-400">Services</a>
            <a href="#process" className="transition-colors hover:text-cyan-400">Process</a>
            <a href="#about" className="transition-colors hover:text-cyan-400">About</a>
            <a href="#contact" className="transition-colors hover:text-cyan-400">Contact</a>
          </nav>

          <a 
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:opacity-90 hover:shadow-cyan-500/40"
          >
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/10 blur-[130px]" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Premier Digital Web Agency
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            We Craft <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">High-Impact</span> Websites for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Ambitious Brands</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg sm:leading-relaxed">
            From luxury restaurants and bespoke boutiques to cutting-edge tech startups and construction firms. We turn visitors into loyal customers with world-class web experiences.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition-all hover:bg-slate-200"
            >
              Explore Live Demos
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Request a Free Consultation
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4">
            <div>
              <p className="text-3xl font-extrabold text-cyan-400">3</p>
              <p className="mt-1 text-xs text-slate-400">Live Production Demos</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="mt-1 text-xs text-slate-400">Responsive & Fast</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-cyan-400">&lt; 1s</p>
              <p className="mt-1 text-xs text-slate-400">Ultra-Fast Load Speeds</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">24/7</p>
              <p className="mt-1 text-xs text-slate-400">Dedicated Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section id="work" className="border-t border-white/10 bg-[#090e1a] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Featured Portfolio Showcase</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Live Client & Concept Websites
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-400">
                Explore real, live websites engineered for modern brands — featuring fast loading, custom editorial design, interactive menus, and conversion-focused customer experiences.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                All Projects ({DEMOS.length})
              </button>
              <button
                onClick={() => setActiveFilter("cafe")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === "cafe"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                Cafe & Bakery
              </button>
              <button
                onClick={() => setActiveFilter("restaurant")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === "restaurant"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                Asian Dining
              </button>
              <button
                onClick={() => setActiveFilter("retail")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === "retail"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                Footwear & Retail
              </button>
            </div>
          </div>

          {/* Demos Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDemos.map((demo) => {
              const IconComp = demo.icon;
              return (
                <div
                  key={demo.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-cyan-300">
                        {demo.badge}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                          {demo.category}
                        </p>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400">{demo.location}</span>
                      </div>
                      <h3 className="mt-1 text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {demo.title}
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-slate-300">
                        {demo.description}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {demo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between gap-3">
                    <a
                      href={demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-sm"
                    >
                      <span>Visit Live Site</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      Discuss Similar
                      <ChevronRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="border-t border-white/10 bg-[#070b14] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">What We Offer</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              End-to-End Digital Solutions
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              We manage everything from initial concept architecture and responsive UI design to high-availability deployment.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((srv, idx) => {
              const SrvIcon = srv.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-cyan-500/30 hover:bg-white/[0.04]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <SrvIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-white">{srv.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="border-t border-white/10 bg-[#090e1a] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Our Workflow</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              From Concept to Launch in 4 Steps
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <span className="text-3xl font-black text-cyan-500/30">{step.step}</span>
                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry / Contact Form */}
      <section id="contact" className="border-t border-white/10 bg-[#070b14] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Start Your Project</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Let's Build Something Exceptional
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Tell us about your brand and vision. We will get back with a roadmap and detailed estimate within 24 hours.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm sm:p-10">
            {formSubmitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Thank you, <span className="font-semibold text-cyan-400">{formData.name}</span>. Our team will review your project details and contact you at <span className="font-semibold text-cyan-400">{formData.email}</span> or via WhatsApp at <span className="font-semibold text-cyan-400">{formData.phone}</span> shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Project Type / Industry
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    >
                      <option value="Artisanal Cafe & Bakery (like Little Umbrella)">Artisanal Cafe & Bakery (like Little Umbrella)</option>
                      <option value="Restaurant & Asian Dining (like DIMSUM BOX)">Restaurant & Asian Dining (like DIMSUM BOX)</option>
                      <option value="Footwear & Retail Store (like The First Step)">Footwear & Retail Store (like The First Step)</option>
                      <option value="Corporate / Creative Agency">Corporate / Creative Agency</option>
                      <option value="Other Custom Web Project">Other Custom Web Project</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Tell us about your requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe what you'd like to build, timeline, or key features..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition-all hover:opacity-95 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Submit Project Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#05080f] px-6 py-12 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img 
              src="/tweb-logo.png" 
              alt="TWeb Logo" 
              className="h-7 w-auto object-contain rounded"
              onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
            />
            <span className="text-base font-bold text-white">TWeb Studio</span>
            <span className="text-xs text-slate-500">| Premium Digital Agency & Portfolio</span>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TWeb. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
