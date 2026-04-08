import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MODEL = "claude-sonnet-4-20250514";
const REQUEST_TIMEOUT_MS = 55000;
const MAX_TOKENS = 4000;

const SYSTEM_PROMPT = `Generate a course outline as compact JSON. No markdown fences.

RULES: 5 modules, 3 lessons each. Lesson = title + 1-sentence description only. 6 learning outcomes. 3 FAQ. Target audience (1-2 sentences). Subtitle must NOT repeat title.

DESIGN: Pick colors matching course mood. Dark bg (#0a-#15), light text, vibrant primary for buttons. Pick fonts from: "Playfair Display"+"DM Sans", "Space Grotesk"+"Inter", "Poppins"+"Inter", "Montserrat"+"DM Sans", "Lora"+"Inter". Vary heroLayout: "left"|"centered"|"split". Spacing: "compact"|"normal"|"spacious". BorderRadius: "none"|"small"|"medium"|"large".

JSON FORMAT:
{"title":"","subtitle":"","description":"","learningOutcomes":["","","","","",""],"modules":[{"title":"","description":"","lessons":[{"title":"","description":""}]}],"design_config":{"colors":{"primary":"#hex","secondary":"#hex","accent":"#hex","background":"#hex","cardBackground":"#hex","text":"#hex","textMuted":"#hex"},"fonts":{"heading":"","body":""},"spacing":"","borderRadius":"","heroStyle":"gradient|minimal|centered","heroLayout":"left|centered|split"},"target_audience":"","faq":[{"question":"","answer":""}],"section_order":["hero","outcomes","who_is_for","curriculum","course_includes","testimonials","pricing","guarantee","faq"]}`;

function parseCourseJson(text: string) {
  // Strip markdown fences
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  // Find JSON boundaries
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  cleaned = cleaned.substring(start, end + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt repair: trailing commas, control chars
    cleaned = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, " ");
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      console.error("JSON repair failed, raw length:", cleaned.length, "error:", e2);
      throw new Error("Failed to parse course JSON from AI response");
    }
  }
}

function isTimeoutError(error: unknown) {
  return error instanceof Error && (
    error.name === "TimeoutError" ||
    error.name === "AbortError" ||
    error.message.toLowerCase().includes("timed out")
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("generate-course invoked (outline + design)");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: authData, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !authData?.user) {
      console.error("generate-course auth failed", authError);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("generate-course auth ok", authData.user.id);

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY") || Deno.env.get("ANTHROPIC_KEY");
    if (!anthropicApiKey) {
      console.error("ANTHROPIC_API_KEY not found in env");
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { prompt, options, attachmentContent } = await req.json();
    if (!prompt || typeof prompt !== "string") throw new Error("prompt is required");

    const designSeed = Math.random().toString(36).slice(2, 6);
    const difficulty = options?.difficulty || "beginner";
    const durationWeeks = options?.duration_weeks || 6;
    const template = options?.template || "creator";
    const lessonFormat = options?.lessonFormat || "mixed";
    const painPoint = options?.audiencePainPoint || "";

    // Tone detection: analyze the user's writing style
    const isAllCaps = (prompt.match(/[A-Z]/g)?.length || 0) > prompt.length * 0.4;
    const hasEmoji = /[\u{1F300}-\u{1FAFF}]/u.test(prompt);
    const hasSlang = /gonna|wanna|gotta|bro|dude|lol|tbh|fr|ngl/i.test(prompt);
    const isFormal = /comprehensive|methodology|framework|professional|certification/i.test(prompt);
    const tone = isFormal ? "professional and authoritative"
      : (hasSlang || hasEmoji || isAllCaps) ? "energetic, casual, and motivating"
      : "friendly and approachable";

    // Build attachment context
    const attachmentContext = attachmentContent
      ? `\n\nCREATOR'S REFERENCE MATERIAL:\n${attachmentContent.slice(0, 8000)}\n\nCRITICAL: Extract the creator's actual topics, frameworks, terminology, and teaching points from this material. Use THEIR words and concepts in module/lesson titles — do NOT make up generic content. The course should feel like it came from this creator, not a template.`
      : "";

    // Build structured context from all guided mode fields
    const durationContext = durationWeeks <= 2 ? "This is a SHORT intensive — fewer modules, dense content"
      : durationWeeks <= 4 ? "This is a medium-length program — balanced pace"
      : durationWeeks <= 8 ? "This is a comprehensive program — room for depth"
      : "This is an extended program — include foundational and advanced content";

    const formatContext = lessonFormat === "video" ? "Lessons should be structured for VIDEO delivery — short, action-oriented titles. Each lesson = one concept or demonstration."
      : lessonFormat === "written" ? "Lessons should be structured for WRITTEN/TEXT delivery — detailed, tutorial-style titles. Each lesson = one complete written guide."
      : "Lessons can mix video and written content — vary the structure.";

    const painPointContext = painPoint
      ? `\nAUDIENCE PAIN POINT: Students have already tried "${painPoint}" and it didn't work. Position this course as the solution — acknowledge what failed and show why this approach is different.`
      : "";

    const templateTone: Record<string, string> = {
      creator: "warm, personal, story-driven",
      technical: "structured, systematic, step-by-step",
      academic: "formal, evidence-based, comprehensive",
      visual: "concise, image-focused, creative",
    };

    const userMessage = `Course about: ${prompt}${attachmentContext}

CREATOR CONTEXT:
- Difficulty: ${difficulty}
- Duration: ${durationWeeks} weeks. ${durationContext}
- Lesson format: ${lessonFormat}. ${formatContext}
- Template style: ${template} (${templateTone[template] || "friendly"})
- Writing tone: ${tone}${painPointContext}
- Design seed: ${designSeed}

Return ONLY valid JSON. Match the tone to "${tone}".`;

    console.log("generate-course requesting Anthropic outline with model:", MODEL);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.8,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    console.log("generate-course Anthropic status", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      if (response.status === 429) {
        throw new Error("Rate limited by AI provider. Please wait a moment and try again.");
      }
      throw new Error(`AI generation failed (${response.status}). Please try again.`);
    }

    const data = await response.json();
    const stopReason = data.stop_reason;
    const text = data.content?.[0]?.text || "";

    console.log("generate-course stop_reason:", stopReason, "text length:", text.length);

    if (stopReason === "max_tokens") {
      console.warn("generate-course: output was truncated by max_tokens");
    }

    const course = parseCourseJson(text);

    if (!course?.title || !Array.isArray(course?.modules) || course.modules.length === 0) {
      throw new Error("AI response missing required course fields");
    }

    console.log("generate-course outline success:", course.title, course.modules.length, "modules",
      course.design_config ? "with design" : "no design");

    return new Response(JSON.stringify(course), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-course error:", e);

    const status = isTimeoutError(e) ? 504 : 500;
    const message = isTimeoutError(e)
      ? "Course generation timed out. Please try again — it usually works on the second attempt."
      : e instanceof Error
        ? e.message
        : "Unknown error";

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
