import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowed = ["https://excellioncourses.com", "https://www.excellioncourses.com"];
  const isAllowed =
    allowed.includes(origin) ||
    origin.endsWith(".lovable.app") ||
    origin.endsWith(".lovableproject.com");
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowed[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  const cors = getCorsHeaders(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  try {
    const contentLength = parseInt(req.headers.get("content-length") || "0");
    if (contentLength > 50000) {
      return json({ error: "Request too large." }, 413);
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 200) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 320) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";

    if (!name) return json({ error: "Name is required." }, 400);
    if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required." }, 400);
    if (!message) return json({ error: "Message is required." }, 400);

    console.log("[submit-contact] processing", { name, email, messageLength: message.length });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { error: dbErr } = await supabase.from("leads").insert({
      email,
      name,
      message,
      source: "contact",
    });

    if (dbErr) {
      console.error("[submit-contact] DB insert error:", dbErr.message);
      return json({ error: "Failed to save your message. Please try again." }, 500);
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message);

      const htmlBody = `<!DOCTYPE html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
<h2 style="margin-bottom: 16px;">New contact form submission</h2>
<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Email:</strong> ${safeEmail}</p>
<p><strong>Message:</strong></p>
<p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 8px;">${safeMessage}</p>
</body></html>`;

      const textBody = `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Excellion Contact <hello@excellioncourses.com>",
            reply_to: email,
            to: ["excellionai@gmail.com"],
            subject: `Contact form: ${name}`,
            html: htmlBody,
            text: textBody,
          }),
        });

        const resendData = await resendRes.json();
        if (!resendRes.ok) {
          console.error("[submit-contact] Resend error:", resendData?.message || JSON.stringify(resendData));
        } else {
          console.log("[submit-contact] notification sent, resend id:", resendData.id);
        }
      } catch (emailErr) {
        console.error("[submit-contact] email send failed:", emailErr);
      }
    } else {
      console.warn("[submit-contact] RESEND_API_KEY not configured, skipping notification email");
    }

    return json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[submit-contact] error:", msg);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
