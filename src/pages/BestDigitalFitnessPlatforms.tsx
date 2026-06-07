import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

const platforms = [
  {
    name: "Excellion",
    best: "AI-built course sites for fitness coaches",
    pricing: "From $29/mo",
    revShare: "2% platform fee",
    aiBuilder: true,
    customDomain: true,
    stripeConnect: true,
    fitnessFocused: true,
  },
  {
    name: "Trainerize",
    best: "1:1 personal training apps",
    pricing: "From $5/mo + per-client fees",
    revShare: "No marketplace cut",
    aiBuilder: false,
    customDomain: false,
    stripeConnect: true,
    fitnessFocused: true,
  },
  {
    name: "TrueCoach",
    best: "Programming + client tracking",
    pricing: "From $19/mo",
    revShare: "No marketplace cut",
    aiBuilder: false,
    customDomain: false,
    stripeConnect: true,
    fitnessFocused: true,
  },
  {
    name: "Kajabi",
    best: "General course creators",
    pricing: "From $149/mo",
    revShare: "0% on Basic+",
    aiBuilder: true,
    customDomain: true,
    stripeConnect: true,
    fitnessFocused: false,
  },
  {
    name: "Teachable",
    best: "Selling individual courses",
    pricing: "From $39/mo + 5% on Basic",
    revShare: "Up to 5% transaction fee",
    aiBuilder: false,
    customDomain: true,
    stripeConnect: true,
    fitnessFocused: false,
  },
  {
    name: "Thinkific",
    best: "DIY course builders",
    pricing: "Free / from $49/mo",
    revShare: "0% on paid plans",
    aiBuilder: false,
    customDomain: true,
    stripeConnect: true,
    fitnessFocused: false,
  },
];

const Cell = ({ ok }: { ok: boolean }) =>
  ok ? (
    <Check className="w-5 h-5 text-primary inline" aria-label="Yes" />
  ) : (
    <X className="w-5 h-5 text-muted-foreground inline" aria-label="No" />
  );

const BestDigitalFitnessPlatforms = () => {
  const path = "/resources/best-digital-fitness-platforms";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Best Digital Fitness Platforms for Coaches in 2026",
      description:
        "Compare the top digital fitness platforms for coaches — features, pricing, revenue share, and which one fits your business.",
      author: { "@type": "Organization", name: "Excellion" },
      datePublished: "2026-06-07",
      mainEntityOfPage: `https://excellioncourses.com${path}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Best Digital Fitness Platforms for Coaches (2026 Comparison)"
        description="Compare the top digital fitness platforms — Excellion, Trainerize, TrueCoach, Kajabi, Teachable, Thinkific. Features, pricing, and revenue share side-by-side."
        path={path}
        jsonLd={jsonLd}
      />
      <Navigation />
      <main className="pt-28 pb-20 px-4">
        <article className="max-w-4xl mx-auto space-y-10">
          <header className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-wider text-primary">Resources · Guide</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Best Digital Fitness Platforms for Coaches in 2026
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A no-fluff comparison of the digital fitness platforms coaches actually use to
              move their business online — features, pricing, and revenue share, side-by-side.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What is a digital fitness platform?</h2>
            <p className="text-muted-foreground">
              A digital fitness platform is the software a coach uses to deliver training, courses,
              or programs online — covering lesson hosting, video, payments, client management, and
              branding. The right one depends on whether you're selling <strong>courses and
              cohorts</strong> (Excellion, Kajabi, Teachable, Thinkific) or doing{" "}
              <strong>1:1 programming and check-ins</strong> (Trainerize, TrueCoach).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Comparison at a glance</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="p-3">Platform</th>
                    <th className="p-3">Best for</th>
                    <th className="p-3">Starting price</th>
                    <th className="p-3">Revenue share</th>
                    <th className="p-3 text-center">AI builder</th>
                    <th className="p-3 text-center">Custom domain</th>
                    <th className="p-3 text-center">Fitness-focused</th>
                  </tr>
                </thead>
                <tbody>
                  {platforms.map((p) => (
                    <tr key={p.name} className="border-t border-border">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-muted-foreground">{p.best}</td>
                      <td className="p-3 text-muted-foreground">{p.pricing}</td>
                      <td className="p-3 text-muted-foreground">{p.revShare}</td>
                      <td className="p-3 text-center"><Cell ok={p.aiBuilder} /></td>
                      <td className="p-3 text-center"><Cell ok={p.customDomain} /></td>
                      <td className="p-3 text-center"><Cell ok={p.fitnessFocused} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Pricing as listed on each platform's public site at time of writing. Always verify
              current plans directly with the vendor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How to choose</h2>
            <ul className="space-y-3 text-muted-foreground list-disc pl-5">
              <li>
                <strong>Selling a fitness course, challenge, or cohort?</strong> Pick a platform
                with a real site builder, custom domain, and Stripe payouts. Excellion is purpose-built
                for this and ships a branded course site in minutes instead of weeks.
              </li>
              <li>
                <strong>1:1 personal training?</strong> Trainerize and TrueCoach are stronger for
                workout programming and client check-ins.
              </li>
              <li>
                <strong>Watch the revenue share.</strong> Some platforms take 5%+ per sale on
                starter plans. Excellion charges a flat 2% platform fee on top of Stripe.
              </li>
              <li>
                <strong>Own your brand.</strong> Custom domain and design control matter — your
                course shouldn't look like everyone else's.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Why coaches pick Excellion</h2>
            <p className="text-muted-foreground">
              Excellion is the only platform on this list built specifically for fitness coaches who
              want a polished course site without hiring a designer. Describe your offer, the AI drafts
              the full site and curriculum, and you fine-tune it. Stripe Connect handles payouts with a
              flat 2% platform fee — no per-sale tiers.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/auth"
                className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Start building free
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center px-6 py-3 rounded-md border border-border font-medium hover:bg-muted transition"
              >
                See pricing
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">What's the cheapest digital fitness platform?</h3>
                <p className="text-muted-foreground">
                  Trainerize starts lowest at $5/mo but adds per-client fees. For course-style offers,
                  Excellion starts at $29/mo with a flat 2% platform fee.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Which platform is best for selling fitness courses?</h3>
                <p className="text-muted-foreground">
                  Excellion is purpose-built for it. Kajabi and Teachable also work but aren't
                  fitness-specific and cost more on entry tiers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Can I use my own domain?</h3>
                <p className="text-muted-foreground">
                  Yes on Excellion, Kajabi, Teachable, and Thinkific. Trainerize and TrueCoach don't
                  offer branded standalone sites.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BestDigitalFitnessPlatforms;