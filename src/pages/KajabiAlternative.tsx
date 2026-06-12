import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const GOLD = "#C9A84C";
const BG = "hsl(38 10% 6%)";
const TEXT = "hsl(40 30% 92%)";
const MUTED = "hsl(40 8% 65%)";
const CARD_BG = "hsl(38 10% 9%)";
const BORDER = "hsl(38 15% 18%)";

const headingFont = '"Playfair Display", serif';
const bodyFont = '"DM Sans", sans-serif';

const faqItems = [
  {
    q: "Is Excellion really cheaper than Kajabi?",
    a: "Yes. Excellion is $79 per month flat after a $29 first month. Kajabi starts at $179 per month with no free plan and runs up to $499 on its Pro tier.",
  },
  {
    q: "Does Excellion take a cut of my sales?",
    a: "No. Zero revenue share. You connect your own Stripe and keep 100 percent minus standard Stripe processing fees.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Your course business runs on your own custom domain so you own the brand and the audience.",
  },
  {
    q: "Can I move from Kajabi to Excellion?",
    a: "Yes. Bring your course content over and rebuild it on Excellion. Most coaches are live in a day.",
  },
];

const comparisonRows = [
  { label: "Starting price", excellion: "$29 first month, then $79/mo flat", kajabi: "Basic $179/mo, no free plan" },
  { label: "Top tier", excellion: "One flat plan", kajabi: "Pro $499/mo" },
  { label: "Revenue share", excellion: "0%", kajabi: "0% on Kajabi Payments" },
  { label: "Your own Stripe", excellion: "Built in via Stripe Connect, no platform surcharge", kajabi: "Adds 2% (Basic), 1% (Growth), 0.5% (Pro)" },
  { label: "Custom domain", excellion: "Yes", kajabi: "Yes, on paid tiers" },
  { label: "Built for", excellion: "Personal trainers and online coaches", kajabi: "General knowledge entrepreneurs and teams" },
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
    <div style={{ backgroundColor: BG, color: TEXT, minHeight: "100vh" }} className="overflow-x-hidden">
      <Helmet>
        <title>Kajabi Alternative for Coaches | Excellion</title>
        <meta name="description" content="Looking for a Kajabi alternative? Excellion lets personal trainers and coaches sell courses on their own domain for $79/mo flat. 0% revenue share, your own Stripe, no surcharge." />
        <link rel="canonical" href="https://excellioncourses.com/kajabi-alternative" />
        <meta property="og:title" content="The Kajabi Alternative Built for Coaches | Excellion" />
        <meta property="og:description" content="$79/mo flat. 0% revenue share. Your own domain and your own Stripe." />
        <meta property="og:image" content="https://excellioncourses.com/og/kajabi-alternative.png" />
        <meta property="og:url" content="https://excellioncourses.com/kajabi-alternative" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Kajabi Alternative Built for Coaches | Excellion" />
        <meta name="twitter:description" content="$79/mo flat. 0% revenue share. Your own domain and your own Stripe." />
        <meta name="twitter:image" content="https://excellioncourses.com/og/kajabi-alternative.png" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <Navigation />

      {/* HERO */}
      <section className="w-full" style={{ paddingTop: "120px", paddingBottom: "80px" }}>
        <div className="mx-auto px-6 text-center" style={{ maxWidth: "900px" }}>
          <h1
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(32px, 5.5vw, 52px)",
              lineHeight: 1.12,
              color: TEXT,
              marginBottom: "28px",
              fontWeight: 600,
            }}
          >
            The Kajabi Alternative Built for Coaches,{" "}
            <span style={{ color: GOLD }}>Not Corporations</span>
          </h1>
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "18px",
              lineHeight: 1.6,
              color: TEXT,
              opacity: 0.85,
              marginBottom: "40px",
              maxWidth: "780px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Kajabi is powerful. It is also $179 to $499 a month, and it now charges you extra to use your own Stripe. If you are a coach who just wants to build a course, put it on your own domain, and keep what you earn, you are paying for a hundred features you will never open. Excellion is the focused alternative. $79 a month flat. Zero revenue share. Your domain, your Stripe, your audience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/"
              className="inline-block transition-transform duration-200 ease-out hover:scale-[1.03]"
              style={{
                backgroundColor: GOLD,
                color: "hsl(38 30% 8%)",
                fontFamily: bodyFont,
                fontWeight: 600,
                fontSize: "16px",
                letterSpacing: "0.02em",
                padding: "18px 36px",
                borderRadius: "6px",
                textDecoration: "none",
                boxShadow: "0 8px 32px -8px rgba(201, 168, 76, 0.4)",
              }}
            >
              Build your first course free
            </a>
            <Link
              to="/founding"
              style={{
                fontFamily: bodyFont,
                fontSize: "15px",
                color: GOLD,
                fontWeight: 500,
                textDecoration: "none",
              }}
              className="hover:underline"
            >
              See the founding coach program
            </Link>
          </div>
        </div>
      </section>

      {/* THE HONEST PART FIRST */}
      <section className="w-full" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "780px" }}>
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(26px, 4vw, 36px)",
              color: TEXT,
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            The honest part first
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "17px",
                color: TEXT,
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              Kajabi is a genuinely strong all in one platform. If you run a large operation with a team, it earns its price. But most coaches just want a clean course, a checkout that works, and a site that is theirs. For that, Kajabi is a heavy, expensive way to do a simple job.
            </p>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "17px",
                color: TEXT,
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              After its January 2026 pricing change it got more expensive and started charging a surcharge to anyone who runs payments through their own Stripe. That is the gap Excellion was built for.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="w-full" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "900px" }}>
          <h2
            className="text-center"
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(26px, 4vw, 36px)",
              color: TEXT,
              marginBottom: "40px",
              fontWeight: 600,
            }}
          >
            Excellion vs Kajabi
          </h2>

          <div
            style={{
              borderRadius: "16px",
              border: `1px solid ${BORDER}`,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-3"
              style={{
                backgroundColor: CARD_BG,
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <div style={{ padding: "16px 20px" }} />
              <div
                className="text-center"
                style={{
                  padding: "16px 20px",
                  fontFamily: headingFont,
                  fontSize: "18px",
                  color: GOLD,
                  fontWeight: 600,
                }}
              >
                Excellion
              </div>
              <div
                className="text-center"
                style={{
                  padding: "16px 20px",
                  fontFamily: headingFont,
                  fontSize: "18px",
                  color: MUTED,
                  fontWeight: 600,
                }}
              >
                Kajabi
              </div>
            </div>

            {/* Table rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-3"
                style={{
                  backgroundColor: i % 2 === 0 ? BG : CARD_BG,
                  borderBottom: i < comparisonRows.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    fontFamily: bodyFont,
                    fontSize: "14px",
                    color: TEXT,
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </div>
                <div
                  className="text-center"
                  style={{
                    padding: "16px 20px",
                    fontFamily: bodyFont,
                    fontSize: "14px",
                    color: TEXT,
                    opacity: 0.9,
                  }}
                >
                  {row.excellion}
                </div>
                <div
                  className="text-center"
                  style={{
                    padding: "16px 20px",
                    fontFamily: bodyFont,
                    fontSize: "14px",
                    color: MUTED,
                  }}
                >
                  {row.kajabi}
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-center"
            style={{
              fontFamily: bodyFont,
              fontSize: "13px",
              color: MUTED,
              opacity: 0.7,
              marginTop: "16px",
            }}
          >
            Kajabi figures reflect monthly billing. Annual billing lowers them by about 20%.
          </p>
        </div>
      </section>

      {/* WHAT YOU ARE REALLY PAYING FOR */}
      <section className="w-full" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "780px" }}>
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(26px, 4vw, 36px)",
              color: TEXT,
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            What you are really paying for
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "17px",
                color: TEXT,
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              On Kajabi Basic at $179 a month, a coach doing $10,000 a month through their own Stripe pays the subscription plus a 2% surcharge on every sale, which runs into thousands a year on top of the plan. You chose your own Stripe for a reason. You should not be taxed for it.
            </p>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "17px",
                color: TEXT,
                opacity: 0.85,
                lineHeight: 1.7,
              }}
            >
              Excellion runs on Stripe Connect. You keep 100% minus standard Stripe processing, no platform cut, no surcharge. One flat $79 a month.
            </p>
          </div>
        </div>
      </section>

      {/* OWN YOUR DOMAIN */}
      <section className="w-full" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "780px" }}>
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(26px, 4vw, 36px)",
              color: TEXT,
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            Own your domain, own your audience
          </h2>
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "17px",
              color: TEXT,
              opacity: 0.85,
              lineHeight: 1.7,
            }}
          >
            Your course lives on your domain. Your buyers are your buyers. If you ever leave, you take your audience and your brand with you. You are building an asset, not renting a storefront.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full" style={{ paddingTop: "64px", paddingBottom: "96px" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "780px" }}>
          <h2
            className="text-center"
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(26px, 4vw, 36px)",
              color: TEXT,
              marginBottom: "48px",
              fontWeight: 600,
            }}
          >
            Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {faqItems.map((item, i) => (
              <div
                key={item.q}
                style={{
                  borderBottom: i < faqItems.length - 1 ? `1px solid ${BORDER}` : "none",
                  padding: "24px 0",
                }}
              >
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontSize: "20px",
                    color: TEXT,
                    fontWeight: 500,
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.q}
                </h3>
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: "15px",
                    color: TEXT,
                    opacity: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="w-full" style={{ paddingTop: "64px", paddingBottom: "120px" }}>
        <div className="mx-auto px-6 text-center" style={{ maxWidth: "720px" }}>
          <h2
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(32px, 5vw, 48px)",
              color: TEXT,
              marginBottom: "32px",
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            Ready to build something that is yours?
          </h2>
          <a
            href="/"
            className="inline-block transition-transform duration-200 ease-out hover:scale-[1.03]"
            style={{
              backgroundColor: GOLD,
              color: "hsl(38 30% 8%)",
              fontFamily: bodyFont,
              fontWeight: 600,
              fontSize: "16px",
              letterSpacing: "0.02em",
              padding: "18px 36px",
              borderRadius: "6px",
              textDecoration: "none",
              boxShadow: "0 8px 32px -8px rgba(201, 168, 76, 0.4)",
            }}
          >
            Build your first course free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KajabiAlternative;
