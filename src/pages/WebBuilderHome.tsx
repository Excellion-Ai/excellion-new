import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet-async";
// FoundingScarcityStrip removed from homepage funnel. /founding route preserved.
import HeroSection from "@/components/HeroSection";
import SocialProofBlock from "@/components/SocialProofBlock";
import SocialProofTicker from "@/components/SocialProofTicker";
import StatsBar from "@/components/StatsBar";
import HowItWorksSection from "@/components/HowItWorksSection";
import DemoVideo from "@/components/DemoVideo";
import FeaturesSection from "@/components/FeaturesSection";


import PricingSection from "@/components/PricingSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import FAQSection from "@/components/FAQSection";

import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const FAQ_ITEMS = [
  { q: "Can I really launch in 1 weekend?", a: "Yes. Excellion generates your course outline, lesson structure, sales page copy, and student portal from a single prompt. You spend the weekend reviewing, filming if needed, and publishing." },
  { q: "What types of fitness courses can I create?", a: "Any fitness niche works. Fat loss, strength training, muscle gain, postpartum, running, home workouts, beginner programs, and more." },
  { q: "Do I need technical skills?", a: "No. Everything is generated and managed through simple prompts and an intuitive editor. No coding required." },
  { q: "Can I use my own domain?", a: "Yes. Publish on your Excellion link or connect your own custom domain at any time." },
  { q: "How does pricing work?", a: "You can preview your course for free. The Pro plan is $29 for your first month, then $79/month. 0% revenue share, cancel anytime." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const WebBuilderHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Course Builder for Fitness Coaches | Excellion</title>
        <meta name="description" content="Excellion builds your course outline, lesson plan, sales copy, and student portal from one prompt. Sell on your own domain for $79/mo. 0% revenue share." />
        <link rel="canonical" href="https://excellioncourses.com/" />
        <meta property="og:title" content="Launch Your Fitness Course in a Weekend | Excellion" />
        <meta property="og:description" content="Generate your full course from one prompt, then sell it on your own domain. 0% revenue share, your own Stripe." />
        <meta property="og:image" content="https://excellioncourses.com/og/home.png" />
        <meta property="og:url" content="https://excellioncourses.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Launch Your Fitness Course in a Weekend | Excellion" />
        <meta name="twitter:description" content="Your full course from one prompt. Sell on your own domain, keep 100%." />
        <meta name="twitter:image" content="https://excellioncourses.com/og/home.png" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      {/* FoundingScarcityStrip removed */}
      <Navigation />
      <main>
        <HeroSection />
        <SocialProofBlock />
        <SocialProofTicker />
        <StatsBar />
        <DemoVideo videoId="Q4rZfRfJIqg" />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <GuaranteeSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default WebBuilderHome;
