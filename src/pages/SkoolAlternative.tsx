import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
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

const comparisonRows = [
  { label: "Where it lives", excellion: "Your own domain, your own site", skool: "skool.com, or a custom URL pointed at their platform" },
  { label: "What you own", excellion: "Your site, your content, your audience", skool: "A community inside their walls" },
  { label: "Monthly cost", excellion: "$29 your first month, then $79", skool: "$9 Hobby or $99 Pro" },
  { label: "Their cut of your sales", excellion: "0%", skool: "10% on Hobby, or a fee that climbs on bigger Pro sales" },
  { label: "Payments", excellion: "Your own Stripe, the relationship stays yours", skool: "Skool's processor" },
  { label: "Built for", excellion: "Selling and delivering coaching programs you own", skool: "A gamified, Facebook-style community" },
  { label: "When they change the rules", excellion: "It's your site, so it doesn't touch you", skool: "You live with it" },
];

const valueBlocks = [
  {
    title: "Your domain, your brand.",
    body: "Your course site lives at yourname.com, not in a platform's subdirectory. Every visitor, every member, every sale builds your asset instead of theirs.",
  },
  {
    title: "Keep 100% of your sales.",
    body: "Excellion takes 0% of what you make. You connect your own Stripe, the money lands with you, and the only thing taken out is the standard processing every platform pays anyway.",
  },
  {
    title: "Cheaper every month.",
    body: "$29 your first month, then $79. No tier you have to climb into, and no cut that grows as you grow.",
  },
  {
    title: "Built to sell and deliver.",
    body: "Real course structure, your own checkout, and the follow-up that reaches members before they go quiet. Owning the platform means owning the relationship too.",
  },
];

const SkoolAlternative = () => {
  return (
    <div style={{ backgroundColor: BG, color: TEXT, minHeight: "100vh" }} className="overflow-x-hidden">
      <Helmet>
        <title>Skool Alternative for Coaches: Own It, Keep 100% | Excellion</title>
        <meta name="description" content="Looking for a Skool alternative? Excellion gives coaches their own branded course site on their own domain. Keep 100% of your sales. $79/month, 0% platform cut." />
        <link rel="canonical" href="https://excellioncourses.com/skool-alternative" />
        <meta property="og:title" content="Skool Alternative for Coaches: Own It, Keep 100% | Excellion" />
        <meta property="og:description" content="Looking for a Skool alternative? Excellion gives coaches their own branded course site on their own domain. Keep 100% of your sales. $79/month, 0% platform cut." />
        <meta property="og:url" content="https://excellioncourses.com/skool-alternative" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Skool Alternative for Coaches: Own It, Keep 100% | Excellion" />
        <meta name="twitter:description" content="Looking for a Skool alternative? Excellion gives coaches their own branded course site on their own domain. Keep 100% of your sales. $79/month, 0% platform cut." />
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
            The Skool alternative{" "}
            <span style={{ color: GOLD }}>you actually own</span>
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
            On Skool, your community and your courses live on their platform, behind their rules, paying their fees. Excellion gives you the same business on your own domain, under your own brand, and you keep 100% of every sale.
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
              Start your own course site
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
              Or claim a founding coach spot
            </Link>
          </div>
        </div>
      </section>

      {/* YOU DON'T OWN WHAT YOU BUILD ON SKOOL */}
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
            You don't own what you build on Skool
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
            Build a thriving community on Skool and look at what you've actually built: an audience that lives at skool.com, on a platform that can change its pricing, its rules, or its features whenever it decides to. It already has. Skool ran one flat plan for years, then split into tiers. The change itself isn't the problem. The problem is it wasn't yours to make. When your business lives on someone else's platform, you're a tenant, and tenants don't get a vote, and they can't take the building with them when they go.
          </p>
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
            Skool vs Excellion
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
                Skool
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
                  {row.skool}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT CHANGES WHEN YOU OWN IT */}
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
            What changes when you own it
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueBlocks.map((block) => (
              <div
                key={block.title}
                style={{
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "16px",
                  padding: "32px",
                }}
              >
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontSize: "20px",
                    color: GOLD,
                    fontWeight: 500,
                    marginBottom: "12px",
                    lineHeight: 1.3,
                  }}
                >
                  {block.title}
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
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHEN SKOOL IS THE RIGHT CALL */}
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
            When Skool is the right call
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
            Skool is genuinely good at one thing: a gamified, Facebook-style community where the group itself is the product. If that's the business you want to run, and you're fine running it on their land, Skool does it well. Excellion is for the coach who wants to own what they build, sell structured programs under their own name, and keep every dollar. Different tools, different bet. This one is about ownership.
          </p>
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "14px",
              color: MUTED,
              marginTop: "20px",
              lineHeight: 1.6,
            }}
          >
            See how Excellion compares to other platforms: <Link to="/kajabi-alternative" style={{ color: GOLD, textDecoration: "none" }} className="hover:underline">Kajabi alternative</Link> | <Link to="/" style={{ color: GOLD, textDecoration: "none" }} className="hover:underline">Back to homepage</Link>
          </p>
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
              marginBottom: "16px",
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            Own your coaching business
          </h2>
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "17px",
              color: TEXT,
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            Stop renting your audience back from a platform. Put your courses on your own domain, keep 100% of your sales, and build something that is actually yours.
          </p>
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
            Start your own course site
          </a>
          <p
            style={{
              fontFamily: bodyFont,
              fontSize: "14px",
              color: GOLD,
              marginTop: "16px",
              fontWeight: 500,
            }}
          >
            <Link to="/founding" style={{ color: GOLD, textDecoration: "none" }} className="hover:underline">
              A few founding coach spots are still open.
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SkoolAlternative;
