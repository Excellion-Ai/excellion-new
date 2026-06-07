import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
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
  { q: "What types of fitness courses can I create?", a: "Any fitness niche works — fat loss, strength training, muscle gain, postpartum, running, home workouts, beginner programs, and more." },
  { q: "Do I need technical skills?", a: "No. Everything is generated and managed through simple prompts and an intuitive editor. No coding required." },
  { q: "Can I use my own domain?", a: "Yes. Publish on your Excellion link or connect your own custom domain at any time." },
  { q: "How does pricing work?", a: "Building and publishing your course is free. The Pro plan is $79/month with a free first month, 0% revenue share, cancel anytime." },
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
      <SEO
        title="Excellion Courses | AI Course Builder for Fitness Coaches"
        description="Generate your fitness course, sales page, and student portal in minutes with Excellion's AI course builder. Launch in one weekend, 0% revenue share."
        path="/"
        jsonLd={[faqJsonLd]}
      />
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
