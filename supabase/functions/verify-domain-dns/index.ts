import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Dynamic CORS — allow production + Lovable preview domains
function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowed = ["https://excellioncourses.com", "https://www.excellioncourses.com"];
  const isAllowed = allowed.includes(origin) || origin.endsWith(".lovable.app") || origin.endsWith(".lovableproject.com");
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  try {
    // Payload size limit: 100KB
    const contentLength = parseInt(req.headers.get("content-length") || "0");
    if (contentLength > 102400) {
      return new Response(
        JSON.stringify({ error: "Request too large. Maximum payload size is 100KB." }),
        { status: 413, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
      );
    }


    // Authenticate user
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { domain, courseId } = await req.json();
    if (!domain || !courseId) {
      return new Response(JSON.stringify({ error: "domain and courseId are required" }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Paywall: custom domains require active or trialing subscription.
    const { data: comp } = await serviceClient
      .from("comp_access")
      .select("email")
      .eq("email", user.email)
      .maybeSingle();

    if (!comp) {
      const Stripe = (await import("https://esm.sh/stripe@18.5.0")).default;
      const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeKey) {
        const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        let hasActiveSub = false;
        if (customers.data.length > 0) {
          const subs = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "active", limit: 1 });
          if (!subs.data.length) {
            const trials = await stripe.subscriptions.list({ customer: customers.data[0].id, status: "trialing", limit: 1 });
            hasActiveSub = trials.data.length > 0;
          } else {
            hasActiveSub = true;
          }
        }
        if (!hasActiveSub) {
          return new Response(JSON.stringify({
            error: "An active subscription is required to connect a custom domain. Start your free month first.",
          }), {
            status: 403,
            headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
          });
        }
      }
    }

    // Verify the user owns this course

    const { data: course } = await serviceClient
      .from("courses")
      .select("id, user_id, custom_domain")
      .eq("id", courseId)
      .single();

    if (!course || course.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Course not found or not owned by you" }), {
        status: 403,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    // Clean domain input
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase().trim();
    const expectedTxt = `excellion=${courseId.slice(0, 8)}`;

    // Verify DNS records using Cloudflare DoH (public, no API key needed)
    let txtVerified = false;
    let aVerified = false;

    // Check TXT record: _verify.{domain}
    try {
      const txtRes = await fetch(
        `https://cloudflare-dns.com/dns-query?name=_verify.${cleanDomain}&type=TXT`,
        { headers: { Accept: "application/dns-json" } },
      );
      const txtData = await txtRes.json();
      const answers = txtData.Answer || [];
      txtVerified = answers.some((a: any) => {
        const val = (a.data || "").replace(/"/g, "").trim();
        return val === expectedTxt;
      });
    } catch (e) {
      console.warn("TXT lookup failed:", e);
    }

    // Check A record
    try {
      const aRes = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=A`,
        { headers: { Accept: "application/dns-json" } },
      );
      const aData = await aRes.json();
      const answers = aData.Answer || [];
      aVerified = answers.some((a: any) => a.data === "185.158.133.1");
    } catch (e) {
      console.warn("A record lookup failed:", e);
    }

    const verified = txtVerified && aVerified;

    // Update domain_verified in courses table
    if (verified) {
      await serviceClient
        .from("courses")
        .update({
          domain_verified: true,
          domain_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", courseId);
    }

    return new Response(
      JSON.stringify({
        verified,
        txtVerified,
        aVerified,
        domain: cleanDomain,
        expectedTxt,
      }),
      {
        status: 200,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("verify-domain-dns error:", err);
    return new Response(
      JSON.stringify({ error: "Verification failed" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
