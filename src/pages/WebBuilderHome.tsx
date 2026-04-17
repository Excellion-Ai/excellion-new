import { Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SocialProofTicker from "@/components/SocialProofTicker";
import StatsBar from "@/components/StatsBar";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";


import PricingSection from "@/components/PricingSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import FAQSection from "@/components/FAQSection";

import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const WebBuilderHome = () => {
  const { user, ready } = useAuth();

  // Logged-in users skip the marketing landing and go straight to their
  // dashboard. Wait for auth to resolve to avoid a flash of the landing
  // for an already-signed-in user. Logged-out users see the marketing site.
  if (ready && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      <SocialProofTicker />
      <StatsBar />
      <HowItWorksSection />
      <FeaturesSection />


      <PricingSection />
      <GuaranteeSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default WebBuilderHome;
