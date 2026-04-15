import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Play, Check, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Paywall shown to signed-in coaches who do NOT have an active Stripe
 * subscription. The "Start Building" CTA triggers Stripe checkout
 * ($29 first month coupon on the public monthly plan → $79/mo after).
 * After payment succeeds, Stripe redirects to /checkout/success, which
 * refreshes the subscription state and forwards to /dashboard.
 *
 * The course builder is gated behind this page — course generation only
 * happens AFTER payment, from inside the builder.
 */
const FEATURES = [
  "AI-generated course with modules and lessons",
  "Sales page with copy that converts",
  "Your own domain",
  "Stripe payments built in, keep 100% of revenue",
  "Edit everything with AI or manually",
];

const Paywall = () => {
  const { user, ready, role } = useAuth();
  const { subscribed, loading: subLoading } = useSubscription();
  const { toast } = useToast();
  const [startingCheckout, setStartingCheckout] = useState(false);

  // Wait until both auth and subscription state have resolved before
  // deciding where this user belongs.
  if (!ready || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?redirect=/paywall" replace />;
  if (!role) return <Navigate to="/onboarding/role" replace />;
  if (role === "student") return <Navigate to="/dashboard/student" replace />;
  // Returning paid users bypass the paywall entirely.
  if (subscribed) return <Navigate to="/dashboard" replace />;

  const handleStart = async () => {
    if (startingCheckout) return;
    setStartingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan: "monthly" },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");
      // Same-tab redirect so Stripe can return the user to /checkout/success
      // without requiring a pop-up-blocked new window.
      window.location.href = data.url;
    } catch (err: any) {
      console.error("[paywall] checkout failed", err);
      toast({
        title: "Couldn't start checkout",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
      setStartingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 px-4 py-12 sm:py-16 flex items-center justify-center">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
            Your course platform is ready.{" "}
            <span className="text-gradient-gold">Let's launch it.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-body mb-8 sm:mb-10">
            Watch how Excellion builds a full fitness course in 60 seconds
          </p>

          {/* Video placeholder — swap in the demo video URL when ready */}
          <div
            role="img"
            aria-label="Demo video coming soon"
            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-zinc-900 via-zinc-950 to-black mb-10"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_40px_rgba(201,168,76,0.45)]">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" fill="currentColor" />
              </span>
            </div>
            <div className="absolute bottom-3 left-4 text-xs text-muted-foreground font-body">
              Demo coming soon
            </div>
          </div>

          {/* What's included */}
          <ul className="text-left max-w-xl mx-auto space-y-3 mb-10">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-base text-foreground/90 font-body">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <div className="mb-6">
            <p className="text-xl sm:text-2xl font-heading font-bold text-foreground">
              <span className="text-gradient-gold">$29</span> for your first month,
              <span className="block sm:inline"> then $79/mo</span>
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleStart}
            disabled={startingCheckout}
            className="min-h-[56px] w-full sm:w-auto px-10 py-4 rounded-xl btn-primary text-base font-body font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
          >
            {startingCheckout ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading checkout…
              </>
            ) : (
              "Start Building"
            )}
          </button>
          <p className="text-sm text-muted-foreground font-body mt-4">
            Cancel anytime. No contracts.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Paywall;
