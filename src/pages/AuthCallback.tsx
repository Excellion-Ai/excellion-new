import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { identifyUser } from "@/lib/analytics";

/**
 * Dedicated OAuth callback route. Google redirects users here with a
 * ?code= PKCE authorization code. We exchange it for a session and then
 * navigate to /dashboard — guards there handle role-based routing
 * (coach vs student vs onboarding).
 *
 * Default UI is a spinner. We only render the error screen when
 * exchangeCodeForSession explicitly returns an error object — no
 * timeouts, no speculative "maybe it failed" states.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // eslint-disable-next-line no-console
    console.log("[oauth-debug] /auth/callback MOUNTED", {
      href: window.location.href,
      search: window.location.search,
      hash: window.location.hash,
    });

    const goToDashboard = (userId?: string, email?: string) => {
      if (cancelled) return;
      if (userId) {
        try {
          identifyUser(userId, { email });
        } catch { /* analytics is best-effort */ }
      }
      navigate("/dashboard", { replace: true });
    };

    // Fallback: if onAuthStateChange fires SIGNED_IN (e.g. session was
    // already set, or exchange succeeded via another path), forward to
    // the dashboard. No timeout — the spinner stays up until a session
    // is available or exchangeCodeForSession returns an error.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // eslint-disable-next-line no-console
      console.log("[oauth-debug] /auth/callback onAuthStateChange", { event, hasSession: !!session });
      if (event === "SIGNED_IN" && session) {
        goToDashboard(session.user.id, session.user.email);
      }
    });

    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      // eslint-disable-next-line no-console
      console.log("[oauth-debug] /auth/callback code present?", !!code);

      if (!code) {
        // No code in URL — possibly the user hit this route while already
        // logged in. If a session already exists, forward immediately.
        const { data: { session } } = await supabase.auth.getSession();
        if (session) goToDashboard(session.user.id, session.user.email);
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;

      if (error) {
        // eslint-disable-next-line no-console
        console.error("[oauth-debug] /auth/callback exchangeCodeForSession error", error);
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        // eslint-disable-next-line no-console
        console.log("[oauth-debug] /auth/callback exchange succeeded", {
          userId: data.session.user.id,
        });
        goToDashboard(data.session.user.id, data.session.user.email);
      }
      // If exchange returned neither an error nor a session, the
      // onAuthStateChange SIGNED_IN listener will catch the session
      // when it arrives.
    };

    void run();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-heading font-bold text-foreground mb-2">Sign-in failed</h1>
          <p className="text-sm text-muted-foreground font-body mb-6 break-words">{errorMsg}</p>
          <button
            type="button"
            onClick={() => navigate("/auth", { replace: true })}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm touch-manipulation"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-body">Completing sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
