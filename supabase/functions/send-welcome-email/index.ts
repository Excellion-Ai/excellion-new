import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowed = ["https://excellioncourses.com", "https://www.excellioncourses.com"];
  const isAllowed = allowed.includes(origin) || origin.endsWith(".lovable.app") || origin.endsWith(".lovableproject.com");
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  const cors = getCorsHeaders(req);
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { user_id } = await req.json();
    if (!user_id) throw new Error("user_id required");

    console.log("[welcome-email] processing for user:", user_id);

    // Check if we already sent a welcome email to this user.
    const { data: existing } = await supabase
      .from("email_log")
      .select("id")
      .eq("user_id", user_id)
      .eq("template", "welcome")
      .limit(1);

    if (existing && existing.length > 0) {
      console.log("[welcome-email] already sent, skipping");
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Get user email from auth.users.
    const { data: { user }, error: userErr } = await supabase.auth.admin.getUserById(user_id);
    if (userErr || !user?.email) {
      throw new Error(`Could not fetch user: ${userErr?.message || "no email"}`);
    }

    const email = user.email;
    // Best-effort first name: try user_metadata, then email prefix.
    const firstName =
      user.user_metadata?.full_name?.split(" ")[0] ||
      user.user_metadata?.name?.split(" ")[0] ||
      email.split("@")[0];

    console.log("[welcome-email] sending to:", email, "name:", firstName);

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const subject = `Welcome to Excellion, ${firstName}`;
    const body = `Hey ${firstName},

Thanks for signing up for Excellion. I'm John, the solo founder. This is an automated welcome but I read every reply personally.

Your dashboard is here: https://excellioncourses.com/dashboard
Your first AI-generated course takes about 60 seconds.

Three quick things that might help:
- Start with the 4-question builder (takes the guesswork out)
- If you have existing content as a PDF, upload it and the AI will structure it
- Everything's editable after generation. Nothing's locked in

If you get stuck or have questions, just reply to this email. I'm active daily and do personal walkthroughs for the first 50 coaches.

Let's build something.

— John
Founder, Excellion
excellioncourses.com`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "John from Excellion <john@mail.excellioncourses.com>",
        reply_to: "excellionai@gmail.com",
        to: [email],
        subject,
        text: body,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      const errMsg = resendData?.message || resendData?.error || JSON.stringify(resendData);
      console.error("[welcome-email] Resend API error:", errMsg);

      await supabase.from("email_log").insert({
        user_id,
        template: "welcome",
        error: errMsg,
      });

      return new Response(JSON.stringify({ error: errMsg }), {
        status: 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    console.log("[welcome-email] sent successfully, resend id:", resendData.id);

    await supabase.from("email_log").insert({
      user_id,
      template: "welcome",
    });

    return new Response(JSON.stringify({ sent: true, id: resendData.id }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[welcome-email] error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
