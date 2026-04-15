import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { destinationForRole, fetchRoleForUser } from "@/lib/roleRouting";
import { identifyUser, analytics } from "@/lib/analytics";

/**
 * Dedicated OAuth callback route. Google redirects users here after
 * completing sign-in. Responsibilities:
 *   1. Log what arrived in the URL (for debugging)
 *   2. Ensure Supabase has exchanged the ?code for a session — either
 *      via detectSessionInUrl (auto) or explicit exchangeCodeForSession
 *   3. Look up the user's role and navigate to the correct dashboard
 *   4. Show a clear error screen if the exchange fails
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let unsubscribe: (() => void) | null = null;

    // eslint-disable-next-line no-console
    console.log("[oauth-debug] /auth/callback MOUNTED", {
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    });

    const routeToDashboard = async (userId: string, email?: string, isNewSignIn = false) => {
      if (cancelled) return;
      try {
        identifyUser(userId, { email });
      } catch { /* analytics is best-effort */ }
      if (isNewSignIn) {
        try {
          analytics.signedUp({ method: "google", email });
        } catch { /* noop */ }
      }
      const role = await fetchRoleForUser(userId);
      if (cancelled) return;
      const dest = role ? destinationForRole(role) : "/onboarding/role";
      // eslint-disable-next-line no-console
      console.log("[oauth-debug] /auth/callback → navigate", { role, dest });
      navigate(dest, { replace: true });
    };

    const run = async () => {
      const sp = new URLSearchParams(window.location.search);
      const hp = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const code = sp.get("code");
      const errorParam = sp.get("error") || hp.get("error");
      const errorDescription = sp.get("error_description") || hp.get("error_description");

      // eslint-disable-next-line no-console
      console.log("[oauth-debug] /auth/callback params", {
        hasCode: !!code,
        errorParam,
        errorDescription,
        queryParams: Object.fromEntries(sp.entries()),
        hashParams: Object.fromEntries(hp.entries()),
      });

      // Google/Supabase explicitly returned an error
      if (errorParam) {
        // eslint-disable-next-line no-console
        console.error("[oauth-debug] /auth/callback error from provider", { errorParam, errorDescription });
        setErrorMsg(errorDescription || errorParam);
        setStatus("error");
        return;
      }

      // Supabase's detectSessionInUrl may have already exchanged the code.
      // Check for an existing session first.
      const { data: { session: existing }, error: getError } = await supabase.auth.getSession();
      if (getError) {
        // eslint-disable-next-line no-console
        console.error("[oauth-debug] /auth/callback getSession error", getError);
      }
      if (existing) {
        // eslint-disable-next-line no-console
        console.log("[oauth-debug] /auth/callback — session already set", {
          userId: existing.user.id,
          provider: existing.user.app_metadata?.provider,
        });
        const ageMs = existing.user.created_at ? Date.now() - new Date(existing.user.created_at).getTime() : Infinity;
        await routeToDashboard(existing.user.id, existing.user.email, ageMs < 60_000);
        return;
      }

      // No session yet. Try an explicit PKCE exchange if we have a ?code=
      if (code) {
        // eslint-disable-next-line no-console
        console.log("[oauth-debug] /auth/callback attempting exchangeCodeForSession");
        const { data, error: exchErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exchErr) {
          // eslint-disable-next-line no-console
          console.error("[oauth-debug] /auth/callback exchangeCodeForSession failed", exchErr);
          setErrorMsg(exchErr.message);
          setStatus("error");
          return;
        }
        if (data.session) {
          // eslint-disable-next-line no-console
          console.log("[oauth-debug] /auth/callback exchange succeeded", {
            userId: data.session.user.id,
            provider: data.session.user.app_metadata?.provider,
          });
          const ageMs = data.session.user.created_at ? Date.now() - new Date(data.session.user.created_at).getTime() : Infinity;
          await routeToDashboard(data.session.user.id, data.session.user.email, ageMs < 60_000);
          return;
        }
      }

      // Still no session — wait for onAuthStateChange to fire (with a timeout).
      // eslint-disable-next-line no-console
      console.log("[oauth-debug] /auth/callback waiting for onAuthStateChange…");
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        // eslint-disable-next-line no-console
        console.log("[oauth-debug] /auth/callback onAuthStateChange", { event, hasSession: !!session });
        if (session) {
          subscription.unsubscribe();
          if (timeoutId) clearTimeout(timeoutId);
          const ageMs = session.user.created_at ? Date.now() - new Date(session.user.created_at).getTime() : Infinity;
          await routeToDashboard(session.user.id, session.user.email, ageMs < 60_000);
        }
      });
      unsubscribe = () => subscription.unsubscribe();

      timeoutId = setTimeout(() => {
        if (cancelled) return;
        subscription.unsubscribe();
        // eslint-disable-next-line no-console
        console.error("[oauth-debug] /auth/callback timed out waiting for session");
        setErrorMsg("Sign-in timed out. Please try again.");
        setStatus("error");
      }, 15_000);
    };

    void run();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-heading font-bold text-foreground mb-2">Sign-in failed</h1>
          <p className="text-sm text-muted-foreground font-body mb-6 break-words">
            {errorMsg || "Something went wrong completing sign-in. Please try again."}
          </p>
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
