import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const faqItems = [
  {
    q: "Is Excellion really cheaper than Kajabi?",
    a: "Yes. Excellion is $79 a month flat after a $29 first month. Kajabi starts at $179 a month with no free plan and runs up to $499 on its Pro tier.",
  },
  {
    q: "Does Excellion take a cut of my sales?",
    a: "No. Zero revenue share. You connect your own Stripe and keep 100% minus standard Stripe processing fees.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Your course business runs on your own custom domain so you own the brand and the audience.",
  },
  {
    q: "Is Kajabi bad?",
    a: "No. Kajabi is a capable all-in-one platform. It is just built for larger operations and priced accordingly. Excellion is the focused, cheaper choice for coaches who mainly want to build and sell courses.",
  },
  {
    q: "Can I move from Kajabi to Excellion?",
    a: "Yes. Bring your course content over and rebuild it on Excellion. Most coaches are live in a day.",
  },
];

const comparisonRows = [
  { label: "Starting price", excellion: "$29 first month, then $79/mo flat", kajabi: "Basic $179/mo, no free plan" },
  { label: "Top tier price", excellion: "One flat plan", kajabi: "Pro $499/mo" },
  { label: "Revenue share", excellion: "0%", kajabi: "0% on Kajabi Payments" },
  { label: "Using your own Stripe", excellion: "Yes, via Stripe Connect, no surcharge", kajabi: "Adds 2% (Basic), 1% (Growth), 0.5% (Pro)" },
  { label: "Your own custom domain", excellion: "Yes", kajabi: "Yes, on paid tiers" },
  { label: "Built for", excellion: "Personal trainers and online coaches", kajabi: "General knowledge entrepreneurs" },
  { label: "Learning curve", excellion: "Build a course in minutes", kajabi: "Full platform, more to learn" },
  { label: "You own the client relationship", excellion: "Yes", kajabi: "Yes" },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const KajabiAlternative = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Kajabi Alternative for Coaches | Excellion (Own Your Domain, 0% Rev Share)</title>
        <meta name="description" content="Looking for a Kajabi alternative? Excellion lets personal trainers and coaches sell courses on their own domain for $79/mo flat. 0% revenue share, your own Stripe, no surcharge." />
        <link rel="canonical" href="https://excellioncourses.com/kajabi-alternative" />
        <meta property="og:title" content="The Kajabi Alternative Built for Coaches | Excellion" />
        <meta property="og:description" content="$79/mo flat. 0% revenue share. Your own domain and your own Stripe. The focused alternative to Kajabi for coaches who just want to sell." />
        <meta property="og:image" content="https://excellioncourses.com/og/kajabi-alternative.png" />
        <meta property="og:url" content="https://excellioncourses.com/kajabi-alternative" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold leading-tight mb-6">
            The Kajabi Alternative Built for{" "}
            <span className="text-gradient-gold">Coaches, Not Corporations</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-body max-w-3xl mx-auto mb-8 leading-relaxed">
            Kajabi is powerful. It is also $179 to $499 a month, and it now charges you extra to use your own Stripe. If you are a coach who just wants to build a course, put it on your own domain, and keep what you earn, you are paying for a hundred features you will never open. Excellion is the focused alternative. $79 a month flat. Zero revenue share. Your domain, your Stripe, your audience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth?mode=signup&redirect=/dashboard"
              className="px-8 py-3.5 rounded-xl btn-primary text-sm font-body font-semibold inline-flex items-center gap-2 touch-manipulation"
            >
              Build your first course free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/founding/apply"
              className="text-sm text-primary font-body font-medium hover:underline"
            >
              See the founding coach program
            </Link>
          </div>
        </section>

        {/* The honest part */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">The honest part first</h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              Kajabi is a genuinely strong all-in-one platform. Email, funnels, landing pages, communities, all in one place. If you run a large operation with a team and want everything under one roof, it earns its price.
            </p>
            <p>
              But most coaches are not that. Most coaches want three things: a clean course, a checkout that works, and a site that is theirs. For that, Kajabi is a heavy, expensive way to do a simple job. And after the January 2026 pricing change, it got more expensive and started charging a surcharge to anyone who runs payments through their own Stripe. That is the gap Excellion was built for.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 text-center">The comparison</h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-card border-b border-border">
              <div className="p-4 text-xs uppercase tracking-wider text-muted-foreground font-body" />
              <div className="p-4 text-center">
                <span className="text-sm font-heading font-bold text-gradient-gold">Excellion</span>
              </div>
              <div className="p-4 text-center">
                <span className="text-sm font-heading font-bold text-muted-foreground">Kajabi</span>
              </div>
            </div>
            {/* Rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-background" : "bg-card/50"}`}
              >
                <div className="p-4 text-sm font-body font-medium text-foreground flex items-start">
                  {row.label}
                </div>
                <div className="p-4 text-sm font-body text-foreground/90 text-center">
                  {row.excellion}
                </div>
                <div className="p-4 text-sm font-body text-muted-foreground text-center">
                  {row.kajabi}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-body text-center mt-4">
            Numbers reflect Kajabi monthly billing as of the 2026 restructure. Annual billing lowers Kajabi prices by roughly 20%.
          </p>
        </section>

        {/* What you're really paying for */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">What you are really paying for</h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              On Kajabi Basic at $179 a month, a coach doing $10,000 a month through their own Stripe pays the subscription plus a 2% surcharge on every sale. That surcharge alone runs into thousands a year, on top of the plan. You chose your own Stripe for a reason. You should not be taxed for it.
            </p>
            <p>
              Excellion runs on Stripe Connect. You connect your own account, you keep 100% of your revenue minus standard Stripe processing, and there is no platform cut and no surcharge. One flat $79 a month. That is the whole bill.
            </p>
          </div>
        </section>

        {/* Own your domain */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">Own your domain, own your audience</h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              The thing that actually matters long term is ownership. Your course lives on your domain. Your buyers are your buyers. If you ever leave, you take your audience and your brand with you. You are building an asset, not renting a storefront. That is true on Kajabi too, to be fair, but Excellion gives you the same ownership without the price tag or the payment surcharge.
            </p>
          </div>
        </section>

        {/* Who Excellion is for */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6">Who Excellion is for</h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              You are a personal trainer or online coach. You have knowledge worth selling. You want it live this week, on your own site, without learning an enterprise platform or signing up for $179 a month to find out if it works. You want to keep what you earn.
            </p>
            <p>
              That is the whole pitch. Build a course free right now and see it for yourself.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Link
              to="/auth?mode=signup&redirect=/dashboard"
              className="px-8 py-3.5 rounded-xl btn-primary text-sm font-body font-semibold inline-flex items-center gap-2 touch-manipulation"
            >
              Build your first course free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/founding/apply"
              className="text-sm text-primary font-body font-medium hover:underline"
            >
              Apply for a founding coach spot
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 text-center">FAQ</h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.q} className="border-b border-border pb-6 last:border-b-0">
                <h3 className="text-base font-heading font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default KajabiAlternative;
